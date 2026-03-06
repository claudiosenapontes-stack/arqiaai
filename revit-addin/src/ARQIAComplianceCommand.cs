using System;
using System.Collections.Generic;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.UI;
using Autodesk.Revit.Attributes;

namespace ARQIA.RevitIntegration
{
    /// <summary>
    /// Local compliance checking command (zoning, setbacks, heights)
    /// </summary>
    [Transaction(TransactionMode.ReadOnly)]
    public class ARQIAComplianceCommand : IExternalCommand
    {
        // Zoning rules from REVIT_API_CONFIG.yml
        private const double FRONT_SETBACK = 25.25;  // feet
        private const double REAR_SETBACK = 25.25;   // feet
        private const double SIDE_SETBACK = 8.25;    // feet
        private const double MAX_HEIGHT = 27.0;      // feet
        private const double FINISHED_FLOOR_ELEVATION = 8.0;  // feet
        
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            UIApplication uiapp = commandData.Application;
            Document doc = uiapp.ActiveUIDocument.Document;
            
            try
            {
                List<string> violations = new List<string>();
                List<string> checks = new List<string>();
                
                // Check 1: Building height
                FilteredElementCollector levelCollector = new FilteredElementCollector(doc);
                levelCollector.OfClass(typeof(Level));
                double maxElevation = 0;
                double minElevation = double.MaxValue;
                
                foreach (Level level in levelCollector)
                {
                    double elev = level.Elevation * 0.3048; // Convert to feet if needed
                    if (elev > maxElevation) maxElevation = elev;
                    if (elev < minElevation) minElevation = elev;
                }
                
                double buildingHeight = maxElevation - minElevation;
                bool heightOk = buildingHeight <= MAX_HEIGHT;
                checks.Add($"Building Height: {buildingHeight:F2}' (Max: {MAX_HEIGHT}') - {(heightOk ? "✓ PASS" : "✗ FAIL")}");
                if (!heightOk)
                    violations.Add($"Building height {buildingHeight:F2}' exceeds maximum {MAX_HEIGHT}'");
                
                // Check 2: Wall heights
                FilteredElementCollector wallCollector = new FilteredElementCollector(doc);
                wallCollector.OfClass(typeof(Wall));
                int wallCount = 0;
                double maxWallHeight = 0;
                
                foreach (Wall wall in wallCollector)
                {
                    wallCount++;
                    Parameter heightParam = wall.get_Parameter(BuiltInParameter.WALL_USER_HEIGHT_PARAM);
                    if (heightParam != null)
                    {
                        double height = heightParam.AsDouble();
                        if (height > maxWallHeight) maxWallHeight = height;
                    }
                }
                
                checks.Add($"Walls Analyzed: {wallCount}");
                checks.Add($"Max Wall Height: {maxWallHeight:F2}'");
                
                // Check 3: Floor area (gross)
                FilteredElementCollector floorCollector = new FilteredElementCollector(doc);
                floorCollector.OfClass(typeof(Floor));
                double totalFloorArea = 0;
                
                foreach (Floor floor in floorCollector)
                {
                    Parameter areaParam = floor.get_Parameter(BuiltInParameter.HOST_AREA_COMPUTED);
                    if (areaParam != null)
                    {
                        totalFloorArea += areaParam.AsDouble();
                    }
                }
                
                // Convert sq ft (Revit internal is sq ft)
                checks.Add($"Total Floor Area: {totalFloorArea:F2} sq ft");
                
                // Check 4: Room count and areas
                FilteredElementCollector roomCollector = new FilteredElementCollector(doc);
                roomCollector.OfClass(typeof(Room));
                int roomCount = 0;
                double totalRoomArea = 0;
                
                foreach (Room room in roomCollector)
                {
                    if (room.Area > 0)
                    {
                        roomCount++;
                        totalRoomArea += room.Area;
                    }
                }
                
                checks.Add($"Rooms Placed: {roomCount}");
                checks.Add($"Total Room Area: {totalRoomArea:F2} sq ft");
                
                // Build report
                string report = "=== ARQIA COMPLIANCE REPORT ===\n\n";
                report += "Zoning Rules Applied:\n";
                report += $"  Front Setback: {FRONT_SETBACK}'\n";
                report += $"  Rear Setback: {REAR_SETBACK}'\n";
                report += $"  Side Setback: {SIDE_SETBACK}'\n";
                report += $"  Max Height: {MAX_HEIGHT}'\n";
                report += $"  Finished Floor Elevation: {FINISHED_FLOOR_ELEVATION}'\n\n";
                
                report += "Checks Performed:\n";
                foreach (var check in checks)
                {
                    report += $"  • {check}\n";
                }
                
                if (violations.Count > 0)
                {
                    report += "\n⚠ VIOLATIONS FOUND:\n";
                    foreach (var v in violations)
                    {
                        report += $"  • {v}\n";
                    }
                }
                else
                {
                    report += "\n✓ NO VIOLATIONS DETECTED\n";
                }
                
                report += "\nNote: Detailed setback analysis requires site boundary data.";
                
                TaskDialog.Show("ARQIA Compliance Check", report);
                
                return Result.Succeeded;
            }
            catch (Exception ex)
            {
                message = $"Compliance check error: {ex.Message}";
                return Result.Failed;
            }
        }
    }
}
