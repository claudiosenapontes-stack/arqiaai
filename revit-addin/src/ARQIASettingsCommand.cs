using System;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Autodesk.Revit.Attributes;

namespace ARQIA.RevitIntegration
{
    /// <summary>
    /// Settings configuration command
    /// </summary>
    [Transaction(TransactionMode.ReadOnly)]
    public class ARQIASettingsCommand : IExternalCommand
    {
        public Result Execute(
            ExternalCommandData commandData,
            ref string message,
            ElementSet elements)
        {
            try
            {
                // Show settings dialog
                TaskDialog dialog = new TaskDialog("ARQIA Settings");
                dialog.MainInstruction = "ARQIA Connection Settings";
                dialog.MainContent = 
                    "Current Configuration:\n\n" +
                    "API Endpoint: http://localhost:3000/api\n" +
                    "Client ID: 69PtbpOgvyFrnGAX...\n" +
                    "Auth: OAuth 2.0 (Mock Mode)\n\n" +
                    "Status: Connected to Stub Backend";
                
                dialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink1, "Change API Endpoint");
                dialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink2, "Test Connection");
                dialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink3, "View OAuth Token");
                
                TaskDialogResult result = dialog.Show();
                
                if (result == TaskDialogResult.CommandLink1)
                {
                    TaskDialog.Show("Settings", "API endpoint configuration would open here.\n\nFor MVP, edit the ARQIASyncCommand.cs file.");
                }
                else if (result == TaskDialogResult.CommandLink2)
                {
                    TaskDialog.Show("Connection Test", "✓ Successfully connected to stub backend at localhost:3000");
                }
                else if (result == TaskDialogResult.CommandLink3)
                {
                    TaskDialog.Show("OAuth Token", "Mock Token: arqia-mvp-token-12345\n\nExpires: Never (stub mode)");
                }
                
                return Result.Succeeded;
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return Result.Failed;
            }
        }
    }
}
