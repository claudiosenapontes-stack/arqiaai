using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.Attributes;

namespace ARQIA.RevitIntegration
{
    /// <summary>
    /// Upload Revit file to ARQIA Cloud / Autodesk OSS
    /// </summary>
    [Transaction(TransactionMode.ReadOnly)]
    public class ARQIAUploadCommand : IExternalCommand
    {
        private static readonly HttpClient client = new HttpClient();
        private const string API_BASE_URL = "http://localhost:3000/api";
        
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            UIApplication uiapp = commandData.Application;
            Document doc = uiapp.ActiveUIDocument.Document;
            
            try
            {
                // Check if document is saved
                if (string.IsNullOrEmpty(doc.PathName))
                {
                    TaskDialog.Show("ARQIA Upload", "Please save the document before uploading.");
                    return Result.Cancelled;
                }
                
                // Confirm upload
                TaskDialog confirmDialog = new TaskDialog("ARQIA Upload");
                confirmDialog.MainInstruction = "Upload to ARQIA Cloud?";
                confirmDialog.MainContent = $"File: {Path.GetFileName(doc.PathName)}\n" +
                                           $"Size: {GetFileSize(doc.PathName)}\n\n" +
                                           "This will upload to Autodesk Platform Services for cloud processing.";
                confirmDialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink1, "Upload Now");
                confirmDialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink2, "Cancel");
                confirmDialog.CommonButtons = TaskDialogCommonButtons.Cancel;
                
                TaskDialogResult result = confirmDialog.Show();
                
                if (result != TaskDialogResult.CommandLink1)
                {
                    return Result.Cancelled;
                }
                
                // Show progress
                TaskDialog progressDialog = new TaskDialog("Uploading...");
                progressDialog.MainInstruction = "Uploading to ARQIA Cloud";
                progressDialog.MainContent = "Reading file and uploading to cloud storage...";
                progressDialog.Show();
                
                // Upload file
                UploadResult uploadResult = UploadFileAsync(doc.PathName).GetAwaiter().GetResult();
                
                if (uploadResult.Success)
                {
                    // Store upload info for translation
                    SaveUploadInfo(doc, uploadResult);
                    
                    // Ask about translation
                    TaskDialog transDialog = new TaskDialog("Upload Complete");
                    transDialog.MainInstruction = "✓ File uploaded successfully!";
                    transDialog.MainContent = $"Object ID: {uploadResult.ObjectId}\n\n" +
                                             "Would you like to start translation for web viewing?";
                    transDialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink1, "Start Translation");
                    transDialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink2, "View in Browser (later)");
                    
                    TaskDialogResult transResult = transDialog.Show();
                    
                    if (transResult == TaskDialogResult.CommandLink1)
                    {
                        // Start translation
                        TranslationResult transResult2 = StartTranslationAsync(uploadResult.ObjectId).GetAwaiter().GetResult();
                        
                        if (transResult2.Success)
                        {
                            TaskDialog.Show("Translation Started", 
                                "✓ Translation job started!\n\n" +
                                $"URN: {transResult2.Urn}\n" +
                                "Status: In Progress\n\n" +
                                "You'll be notified when complete.");
                        }
                        else
                        {
                            TaskDialog.Show("Translation Error", transResult2.ErrorMessage);
                        }
                    }
                    
                    return Result.Succeeded;
                }
                else
                {
                    message = $"Upload failed: {uploadResult.ErrorMessage}";
                    TaskDialog.Show("Upload Failed", message);
                    return Result.Failed;
                }
            }
            catch (Exception ex)
            {
                message = $"Upload error: {ex.Message}";
                TaskDialog.Show("Upload Error", message);
                return Result.Failed;
            }
        }
        
        /// <summary>
        /// Upload file to backend/OSS
        /// </summary>
        private async Task<UploadResult> UploadFileAsync(string filePath)
        {
            try
            {
                // Read file as base64
                byte[] fileBytes = File.ReadAllBytes(filePath);
                string base64Content = Convert.ToBase64String(fileBytes);
                
                var payload = new
                {
                    bucketKey = $"arqia-{DateTime.UtcNow:yyyyMMdd}",
                    objectName = Path.GetFileName(filePath),
                    fileData = base64Content,
                    contentType = "application/octet-stream"
                };
                
                string jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                
                HttpResponseMessage response = await client.PostAsync(
                    $"{API_BASE_URL}/aps/upload", 
                    content
                );
                
                string responseBody = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    dynamic result = JsonConvert.DeserializeObject(responseBody);
                    return new UploadResult
                    {
                        Success = true,
                        ObjectId = result.objectId,
                        UploadId = result.uploadId,
                        Location = result.location
                    };
                }
                else
                {
                    return new UploadResult
                    {
                        Success = false,
                        ErrorMessage = $"HTTP {(int)response.StatusCode}: {responseBody}"
                    };
                }
            }
            catch (Exception ex)
            {
                return new UploadResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }
        
        /// <summary>
        /// Start Model Derivative translation
        /// </summary>
        private async Task<TranslationResult> StartTranslationAsync(string objectId)
        {
            try
            {
                // Convert objectId to URN (base64)
                string urn = Convert.ToBase64String(Encoding.UTF8.GetBytes(objectId))
                    .TrimEnd('=')
                    .Replace('+', '-')
                    .Replace('/', '_');
                
                var payload = new
                {
                    urn = urn,
                    outputFormat = "svf2"
                };
                
                string jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                
                HttpResponseMessage response = await client.PostAsync(
                    $"{API_BASE_URL}/aps/translate",
                    content
                );
                
                string responseBody = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    dynamic result = JsonConvert.DeserializeObject(responseBody);
                    return new TranslationResult
                    {
                        Success = true,
                        Urn = urn,
                        Result = result.job
                    };
                }
                else
                {
                    return new TranslationResult
                    {
                        Success = false,
                        ErrorMessage = $"HTTP {(int)response.StatusCode}: {responseBody}"
                    };
                }
            }
            catch (Exception ex)
            {
                return new TranslationResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }
        
        /// <summary>
        /// Save upload info for later use
        /// </summary>
        private void SaveUploadInfo(Document doc, UploadResult uploadResult)
        {
            try
            {
                string appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                string arqiaPath = Path.Combine(appDataPath, "ARQIA");
                Directory.CreateDirectory(arqiaPath);
                
                string infoFile = Path.Combine(arqiaPath, "last_upload.json");
                var info = new
                {
                    DocumentPath = doc.PathName,
                    UploadId = uploadResult.UploadId,
                    ObjectId = uploadResult.ObjectId,
                    UploadedAt = DateTime.UtcNow.ToString("o")
                };
                
                File.WriteAllText(infoFile, JsonConvert.SerializeObject(info, Formatting.Indented));
            }
            catch { /* Non-critical */ }
        }
        
        /// <summary>
        /// Get human-readable file size
        /// </summary>
        private string GetFileSize(string filePath)
        {
            try
            {
                long bytes = new FileInfo(filePath).Length;
                string[] sizes = { "B", "KB", "MB", "GB" };
                int order = 0;
                while (bytes >= 1024 && order < sizes.Length - 1)
                {
                    order++;
                    bytes = bytes / 1024;
                }
                return $"{bytes:0.##} {sizes[order]}";
            }
            catch
            {
                return "Unknown";
            }
        }
    }
    
    public class UploadResult
    {
        public bool Success { get; set; }
        public string ObjectId { get; set; }
        public string UploadId { get; set; }
        public string Location { get; set; }
        public string ErrorMessage { get; set; }
    }
    
    public class TranslationResult
    {
        public bool Success { get; set; }
        public string Urn { get; set; }
        public dynamic Result { get; set; }
        public string ErrorMessage { get; set; }
    }
}
