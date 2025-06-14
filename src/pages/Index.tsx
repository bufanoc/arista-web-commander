
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  Server, 
  Activity, 
  Settings, 
  Plus, 
  Wifi, 
  Router,
  Shield,
  Cable,
  Layers,
  Terminal,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { SwitchDiscovery } from "@/components/SwitchDiscovery";
import { SwitchList } from "@/components/SwitchList";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { CommandCenter } from "@/components/CommandCenter";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [switches, setSwitches] = useState([
    {
      id: "1",
      name: "Core-Switch-01",
      ip: "192.168.1.10",
      model: "DCS-7050SX3-48YC8",
      version: "4.28.3M",
      status: "online",
      uptime: "45d 12h 34m",
      interfaces: { total: 54, up: 48, down: 6 },
      lastSeen: new Date().toISOString()
    },
    {
      id: "2", 
      name: "Access-Switch-02",
      ip: "192.168.1.20",
      model: "DCS-7280SR-48C6",
      version: "4.27.5M",
      status: "online",
      uptime: "23d 8h 15m",
      interfaces: { total: 48, up: 44, down: 4 },
      lastSeen: new Date().toISOString()
    },
    {
      id: "3",
      name: "Leaf-Switch-03", 
      ip: "192.168.1.30",
      model: "DCS-7320X-32C",
      version: "4.28.3M",
      status: "warning",
      uptime: "12d 4h 22m",
      interfaces: { total: 32, up: 28, down: 4 },
      lastSeen: new Date().toISOString()
    }
  ]);

  const totalSwitches = switches.length;
  const onlineSwitches = switches.filter(s => s.status === "online").length;
  const totalInterfaces = switches.reduce((sum, s) => sum + s.interfaces.total, 0);
  const activeInterfaces = switches.reduce((sum, s) => sum + s.interfaces.up, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Network className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Arista EOS Manager</h1>
          </div>
          <p className="text-slate-600">Comprehensive network switch management and configuration platform</p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="switches" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Switches
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="commands" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Commands
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Switches</CardTitle>
                  <Server className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">{totalSwitches}</div>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3" />
                    {onlineSwitches} online
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Interfaces</CardTitle>
                  <Cable className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">{activeInterfaces}</div>
                  <p className="text-xs text-slate-500">of {totalInterfaces} total</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Network Health</CardTitle>
                  <Activity className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Good</div>
                  <p className="text-xs text-slate-500">All systems operational</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <p className="text-xs text-slate-500">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Core-Switch-01 Interface Up</p>
                      <p className="text-sm text-slate-600">Ethernet48 came online</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">2m ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Configuration Backup</p>
                      <p className="text-sm text-slate-600">All switches backed up successfully</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">15m ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">High CPU Usage</p>
                      <p className="text-sm text-slate-600">Leaf-Switch-03 at 85%</p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">1h ago</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Switch
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Bulk Configuration
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Router className="h-4 w-4 mr-2" />
                    Network Topology
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Switch Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-500" />
                  Switch Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {switches.map((switch_) => (
                    <div key={switch_.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-800">{switch_.name}</h3>
                        <Badge 
                          variant={switch_.status === "online" ? "default" : "secondary"}
                          className={switch_.status === "online" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                        >
                          {switch_.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>IP: {switch_.ip}</p>
                        <p>Model: {switch_.model}</p>
                        <p>Uptime: {switch_.uptime}</p>
                        <p>Interfaces: {switch_.interfaces.up}/{switch_.interfaces.total} up</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Switches Tab */}
          <TabsContent value="switches">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Switch Management</h2>
                <SwitchDiscovery onSwitchAdded={(newSwitch) => setSwitches([...switches, newSwitch])} />
              </div>
              <SwitchList switches={switches} onSwitchUpdate={setSwitches} />
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config">
            <ConfigurationPanel switches={switches} />
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <MonitoringDashboard switches={switches} />
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands">
            <CommandCenter switches={switches} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
