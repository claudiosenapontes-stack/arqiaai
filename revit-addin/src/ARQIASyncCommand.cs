using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.UI;
using Autodesk.Revit.Attributes;

namespace ARQIA.RevitIntegration
{
    /// <summary>
    /// Main sync command - triggered by Ribbon button
    /// </summary>
    [Transaction(TransactionMode.ReadOnly)]
    public class ARQIASyncCommand : IExternalCommand
    {
        private static readonly HttpClient client = new HttpClient();
        private const string API_BASE_URL = "http://localhost:3000/api"; // Configurable
        
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            UIApplication uiapp = commandData.Application;
            Document doc = uiapp.ActiveUIDocument.Document;
            
            try
            {
                // Show sync progress dialog
                TaskDialog syncDialog = new TaskDialog("ARQIA Sync");
                syncDialog.MainInstruction = "Syncing project to ARQIA Cloud...";
                syncDialog.MainContent = "Extracting model data and uploading to ARQIA backend.";
                syncDialog.Show();
                
                // Extract document data
                ARQIAProjectPayload payload = ExtractDocumentData(doc);
                
                // Send to backend
                SyncResult result = SendToBackend(payload).GetAwaiter().GetResult();
                
                // Show result
                if (result.Success)
                {
                    TaskDialog.Show("ARQIA Sync Complete", 
                        $"✓ Project synced successfully!\n\n" +
                        $"Token: {result.Token}\n" +
                        $"Status: {result.Status}\n" +
                        $"Elements: {payload.ElementCount}\n" +
                        $"Timestamp: {result.Timestamp}");
                    return Result.Succeeded;
                }
                else
                {
                    message = $"Sync failed: {result.ErrorMessage}";
                    TaskDialog.Show("ARQIA Sync Failed", message);
                    return Result.Failed;
                }
            }
            catch (Exception ex)
            {
                message = $"ARQIA Sync Error: {ex.Message}";
                TaskDialog.Show("Sync Error", message);
                return Result.Failed;
            }
        }
        
        /// <summary>
        /// Extract relevant data from the Revit document
        /// </summary>
        private ARQIAProjectPayload ExtractDocumentData(Document doc)
        {
            var payload = new ARQIAProjectPayload
            {
                ProjectId = doc.ProjectInformation?.UniqueId ?? Guid.NewGuid().ToString(),
                ProjectName = doc.ProjectInformation?.Name ?? "Unnamed Project",
                ProjectNumber = doc.ProjectInformation?.Number ?? "",
                FilePath = doc.PathName,
                DocumentTitle = doc.Title,
                SyncTimestamp = DateTime.UtcNow.ToString("o"),
                RevitVersion = doc.Application.VersionName,
                Elements = new List<ElementData>(),
                LevelData = new List<LevelInfo>(),
                ComplianceChecks = new ComplianceData()
            };
            
            // Extract levels
            FilteredElementCollector levelCollector = new FilteredElementCollector(doc);
            levelCollector.OfClass(typeof(Level));
            foreach (Level level in levelCollector)
            {
                payload.LevelData.Add(new LevelInfo
                {
                    Id = (int)level.Id.Value,
                    Name = level.Name,
                    Elevation = level.Elevation
                });
            }
            
            // Extract walls (for compliance checking)
            FilteredElementCollector wallCollector = new FilteredElementCollector(doc);
            wallCollector.OfClass(typeof(Wall));
            foreach (Wall wall in wallCollector)
            {
                var wallData = new ElementData
                {
                    Id = (int)(wall.Id.Value),
                    UniqueId = wall.UniqueId,
                    Category = "Wall",
                    Name = wall.Name,
                    Volume = wall.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)?.AsDouble() ?? 0,
                    Area = wall.get_Parameter(BuiltInParameter.HOST_AREA_COMPUTED)?.AsDouble() ?? 0,
                    Length = wall.get_Parameter(BuiltInParameter.CURVE_ELEM_LENGTH)?.AsDouble() ?? 0
                };
                
                // Get wall location/geometry
                LocationCurve location = wall.Location as LocationCurve;
                if (location != null)
                {
                    wallData.CurveData = new CurveInfo
                    {
                        StartX = location.Curve.GetEndPoint(0).X,
                        StartY = location.Curve.GetEndPoint(0).Y,
                        StartZ = location.Curve.GetEndPoint(0).Z,
                        EndX = location.Curve.GetEndPoint(1).X,
                        EndY = location.Curve.GetEndPoint(1).Y,
                        EndZ = location.Curve.GetEndPoint(1).Z
                    };
                }
                
                payload.Elements.Add(wallData);
            }
            
            // Extract floors
            FilteredElementCollector floorCollector = new FilteredElementCollector(doc);
            floorCollector.OfClass(typeof(Floor));
            foreach (Floor floor in floorCollector)
            {
                payload.Elements.Add(new ElementData
                {
                    Id = (int)(floor.Id.Value),
                    UniqueId = floor.UniqueId,
                    Category = "Floor",
                    Name = floor.Name,
                    Area = floor.get_Parameter(BuiltInParameter.HOST_AREA_COMPUTED)?.AsDouble() ?? 0,
                    Volume = floor.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED)?.AsDouble() ?? 0
                });
            }
            
            // Extract rooms for area calculations
            FilteredElementCollector roomCollector = new FilteredElementCollector(doc);
            roomCollector.OfClass(typeof(Room));
// Room extraction disabled for Revit 2026 compatibility
                }
            }
            
            payload.ElementCount = payload.Elements.Count;
            
            return payload;
        }
        
        /// <summary>
        /// Send payload to backend API
        /// </summary>
        private async Task<SyncResult> SendToBackend(ARQIAProjectPayload payload)
        {
            try
            {
                string jsonPayload = JsonConvert.SerializeObject(payload, Formatting.Indented);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                
                HttpResponseMessage response = await client.PostAsync($"{API_BASE_URL}/arqia/sync", content);
                string responseBody = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode)
                {
                    var result = JsonConvert.DeserializeObject<SyncResult>(responseBody);
                    result.Success = true;
                    return result;
                }
                else
                {
                    return new SyncResult
                    {
                        Success = false,
                        ErrorMessage = $"HTTP {(int)response.StatusCode}: {responseBody}"
                    };
                }
            }
            catch (Exception ex)
            {
                return new SyncResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }
    }
    
    // ==================== DATA MODELS ====================
    
    public class ARQIAProjectPayload
    {
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectNumber { get; set; }
        public string FilePath { get; set; }
        public string DocumentTitle { get; set; }
        public string SyncTimestamp { get; set; }
        public string RevitVersion { get; set; }
        public int ElementCount { get; set; }
        public List<ElementData> Elements { get; set; }
        public List<LevelInfo> LevelData { get; set; }
        public ComplianceData ComplianceChecks { get; set; }
    }
    
    public class ElementData
    {
        public int Id { get; set; }
        public string UniqueId { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public string Number { get; set; }
        public double Volume { get; set; }
        public double Area { get; set; }
        public double Length { get; set; }
        public CurveInfo CurveData { get; set; }
    }
    
    public class CurveInfo
    {
        public double StartX { get; set; }
        public double StartY { get; set; }
        public double StartZ { get; set; }
        public double EndX { get; set; }
        public double EndY { get; set; }
        public double EndZ { get; set; }
    }
    
    public class LevelInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Elevation { get; set; }
    }
    
    public class ComplianceData
    {
        public bool ZoningChecked { get; set; }
        public bool SetbacksValid { get; set; }
        public bool HeightLimitsValid { get; set; }
        public List<string> Violations { get; set; } = new List<string>();
    }
    
    public class SyncResult
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string Status { get; set; }
        public string Timestamp { get; set; }
        public string ErrorMessage { get; set; }
    }
}
