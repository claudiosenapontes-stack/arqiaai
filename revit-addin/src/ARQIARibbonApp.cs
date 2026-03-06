using System;
using System.IO;
using System.Reflection;
using System.Windows.Media.Imaging;
using Autodesk.Revit.UI;

namespace ARQIA.RevitIntegration
{
    /// <summary>
    /// Application-level add-in that creates the ARQIA Ribbon tab
    /// </summary>
    public class ARQIARibbonApp : IExternalApplication
    {
        private const string TAB_NAME = "ARQIA";
        private const string PANEL_NAME = "Project Sync";
        
        public Result OnStartup(UIControlledApplication application)
        {
            try
            {
                // Create ARQIA Ribbon Tab
                application.CreateRibbonTab(TAB_NAME);
                
                // Create Sync Panel
                RibbonPanel panel = application.CreateRibbonPanel(TAB_NAME, PANEL_NAME);
                
                // Get path to this assembly
                string assemblyPath = Assembly.GetExecutingAssembly().Location;
                
                // Create Sync to Cloud button
                PushButtonData syncButtonData = new PushButtonData(
                    "ARQIASyncButton",
                    "Sync to\nARQIA",
                    assemblyPath,
                    "ARQIA.RevitIntegration.ARQIASyncCommand"
                );
                
                syncButtonData.ToolTip = "Sync current Revit project to ARQIA Cloud for compliance analysis";
                syncButtonData.LongDescription = "Uploads project metadata, elements, and geometry to ARQIA backend for automated zoning and code compliance checking.";
                
                // Add icon (will use default if custom not found)
                try
                {
                    string iconPath = Path.Combine(
                        Path.GetDirectoryName(assemblyPath),
                        "assets",
                        "arqia-sync-icon.png"
                    );
                    if (File.Exists(iconPath))
                    {
                        syncButtonData.LargeImage = new BitmapImage(new Uri(iconPath));
                    }
                }
                catch { /* Use default icon */ }
                
                PushButton syncButton = panel.AddItem(syncButtonData) as PushButton;
                
                // Create Settings button
                PushButtonData settingsButtonData = new PushButtonData(
                    "ARQIASettingsButton",
                    "Settings",
                    assemblyPath,
                    "ARQIA.RevitIntegration.ARQIASettingsCommand"
                );
                
                settingsButtonData.ToolTip = "Configure ARQIA connection settings";
                
                PushButton settingsButton = panel.AddItem(settingsButtonData) as PushButton;
                
                // Add separator
                panel.AddSeparator();
                
                // Create Compliance Check button
                PushButtonData complianceButtonData = new PushButtonData(
                    "ARQIAComplianceButton",
                    "Check\nCompliance",
                    assemblyPath,
                    "ARQIA.RevitIntegration.ARQIAComplianceCommand"
                );
                
                complianceButtonData.ToolTip = "Run local zoning and code compliance checks";
                
                PushButton complianceButton = panel.AddItem(complianceButtonData) as PushButton;
                
                // Create second panel for Cloud
                RibbonPanel cloudPanel = application.CreateRibbonPanel(TAB_NAME, "Cloud");
                
                // Upload to Cloud button
                PushButtonData uploadButtonData = new PushButtonData(
                    "ARQIAUploadButton",
                    "Upload to\nCloud",
                    assemblyPath,
                    "ARQIA.RevitIntegration.ARQIAUploadCommand"
                );
                
                uploadButtonData.ToolTip = "Upload Revit file to ARQIA Cloud (Autodesk OSS)";
                uploadButtonData.LongDescription = "Uploads the current Revit file to Autodesk Platform Services cloud storage for translation and web viewing.";
                
                PushButton uploadButton = cloudPanel.AddItem(uploadButtonData) as PushButton;
                
                // View in Browser button
                PushButtonData viewerButtonData = new PushButtonData(
                    "ARQIAViewerButton",
                    "View in\nBrowser",
                    assemblyPath,
                    "ARQIA.RevitIntegration.ARQIAViewerCommand"
                );
                
                viewerButtonData.ToolTip = "View uploaded model in web browser";
                viewerButtonData.LongDescription = "Opens the translated model in Autodesk Viewer in your default web browser.";
                
                PushButton viewerButton = cloudPanel.AddItem(viewerButtonData) as PushButton;
                
                // Create third panel for Tools
                RibbonPanel toolsPanel = application.CreateRibbonPanel(TAB_NAME, "Tools");
                
                // Setback Generator button
                PushButtonData setbackButtonData = new PushButtonData(
                    "ARQIASetbackButton",
                    "Generate\nSetbacks",
                    assemblyPath,
                    "ARQIA.RevitIntegration.ARQIASetbackGenerator"
                );
                
                setbackButtonData.ToolTip = "Generate setback limits based on zoning rules";
                
                PushButton setbackButton = toolsPanel.AddItem(setbackButtonData) as PushButton;
                
                return Result.Succeeded;
            }
            catch (Exception ex)
            {
                // Log error
                System.Diagnostics.Debug.WriteLine($"ARQIA Ribbon Error: {ex.Message}");
                return Result.Failed;
            }
        }
        
        public Result OnShutdown(UIControlledApplication application)
        {
            return Result.Succeeded;
        }
    }
}
