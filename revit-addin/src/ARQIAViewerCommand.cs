using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.Attributes;

namespace ARQIA.RevitIntegration
{
    /// <summary>
    /// View uploaded model in browser using Autodesk Viewer
    /// </summary>
    [Transaction(TransactionMode.ReadOnly)]
    public class ARQIAViewerCommand : IExternalCommand
    {
        private static readonly HttpClient client = new HttpClient();
        private const string API_BASE_URL = "http://localhost:3000/api";
        private const string VIEWER_URL = "http://localhost:3000/viewer"; // Local viewer page
        
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            try
            {
                // Check for last upload
                string appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                string infoFile = Path.Combine(appDataPath, "ARQIA", "last_upload.json");
                
                string urn = null;
                string objectId = null;
                
                if (File.Exists(infoFile))
                {
                    string json = File.ReadAllText(infoFile);
                    dynamic info = JsonConvert.DeserializeObject(json);
                    objectId = info.ObjectId;
                    
                    // Convert objectId to URN
                    urn = ConvertToSafeBase64(objectId);
                }
                
                if (string.IsNullOrEmpty(urn))
                {
                    TaskDialog.Show("ARQIA Viewer", 
                        "No uploaded model found.\n\n" +
                        "Please upload a file first using 'Upload to Cloud'.");
                    return Result.Cancelled;
                }
                
                // Check translation status
                TaskDialog.Show("ARQIA Viewer", "Checking translation status...");
                
                TranslationStatus status = CheckTranslationStatusAsync(urn).GetAwaiter().GetResult();
                
                if (status.Status == "success")
                {
                    // Open viewer
                    string viewerUrl = $"{VIEWER_URL}?urn={urn}";
                    OpenInBrowser(viewerUrl);
                    
                    TaskDialog.Show("ARQIA Viewer", 
                        "✓ Opening model in browser...\n\n" +
                        $"URN: {urn.Substring(0, 20)}...\n" +
                        "Status: Translation complete");
                    
                    return Result.Succeeded;
                }
                else if (status.Status == "inprogress" || status.Status == "pending")
                {
                    TaskDialog.Show("ARQIA Viewer", 
                        "⏳ Translation in progress...\n\n" +
                        "Please wait a few minutes and try again.\n" +
                        "Large models may take 5-10 minutes to process.");
                    return Result.Succeeded;
                }
                else
                {
                    TaskDialog.Show("ARQIA Viewer", 
                        "❌ Translation failed or not started.\n\n" +
                        $"Status: {status.Status}\n" +
                        $"Error: {status.ErrorMessage ?? "Unknown"}");
                    return Result.Failed;
                }
            }
            catch (Exception ex)
            {
                message = $"Viewer error: {ex.Message}";
                TaskDialog.Show("Viewer Error", message);
                return Result.Failed;
            }
        }
        
        /// <summary>
        /// Check translation job status
        /// </summary>
        private async Task<TranslationStatus> CheckTranslationStatusAsync(string urn)
        {
            try
            {
                HttpResponseMessage response = await client.GetAsync(
                    $"{API_BASE_URL}/aps/translate/{urn}/status"
                );
                
                string responseBody = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    dynamic result = JsonConvert.DeserializeObject(responseBody);
                    return new TranslationStatus
                    {
                        Status = result.status,
                        Progress = result.progress,
                        ErrorMessage = result.messages?.ToString()
                    };
                }
                else
                {
                    return new TranslationStatus
                    {
                        Status = "error",
                        ErrorMessage = $"HTTP {(int)response.StatusCode}"
                    };
                }
            }
            catch (Exception ex)
            {
                return new TranslationStatus
                {
                    Status = "error",
                    ErrorMessage = ex.Message
                };
            }
        }
        
        /// <summary>
        /// Convert string to URL-safe base64
        /// </summary>
        private string ConvertToSafeBase64(string input)
        {
            string base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(input));
            return base64.TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }
        
        /// <summary>
        /// Open URL in default browser
        /// </summary>
        private void OpenInBrowser(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                TaskDialog.Show("Browser Error", 
                    $"Could not open browser:\n{ex.Message}\n\n" +
                    $"URL: {url}");
            }
        }
    }
    
    public class TranslationStatus
    {
        public string Status { get; set; }
        public string Progress { get; set; }
        public string ErrorMessage { get; set; }
    }
}
