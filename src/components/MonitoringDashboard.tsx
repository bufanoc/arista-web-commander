
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Thermometer, 
  Zap,
  Network,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Switch {
  id: string;
  name: string;
  ip: string;
  model: string;
  version: string;
  status: string;
  uptime: string;
  interfaces: { total: number; up: number; down: number };
  lastSeen: string;
}

interface MonitoringDashboardProps {
  switches: Switch[];
}

export const MonitoringDashboard = ({ switches }: MonitoringDashboardProps) => {
  const [selectedSwitch, setSelectedSwitch] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cpuData, setCpuData] = useState([
    { time: '00:00', value: 45 },
    { time: '00:05', value: 52 },
    { time: '00:10', value: 48 },
    { time: '00:15', value: 61 },
    { time: '00:20', value: 55 },
    { time: '00:25', value: 67 },
    { time: '00:30', value: 43 },
  ]);
  
  const [memoryData, setMemoryData] = useState([
    { time: '00:00', value: 68 },
    { time: '00:05', value: 72 },
    { time: '00:10', value: 69 },
    { time: '00:15', value: 75 },
    { time: '00:20', value: 71 },
    { time: '00:25', value: 78 },
    { time: '00:30', value: 74 },
  ]);

  const [interfaceStats, setInterfaceStats] = useState([
    { name: 'Ethernet1', status: 'up', utilization: 85, errors: 0, speed: '10G' },
    { name: 'Ethernet2', status: 'up', utilization: 42, errors: 2, speed: '10G' },
    { name: 'Ethernet3', status: 'down', utilization: 0, errors: 0, speed: '10G' },
    { name: 'Ethernet48', status: 'up', utilization: 67, errors: 1, speed: '10G' },
    { name: 'Management1', status: 'up', utilization: 15, errors: 0, speed: '1G' },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh
      const newCpuValue = Math.floor(Math.random() * 30) + 40;
      const newMemoryValue = Math.floor(Math.random() * 20) + 65;
      
      setCpuData(prev => [...prev.slice(1), { 
        time: new Date().toLocaleTimeString().slice(0, 5), 
        value: newCpuValue 
      }]);
      
      setMemoryData(prev => [...prev.slice(1), { 
        time: new Date().toLocaleTimeString().slice(0, 5), 
        value: newMemoryValue 
      }]);
      
      setIsRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedSwitch) {
        const newCpuValue = Math.floor(Math.random() * 30) + 40;
        const newMemoryValue = Math.floor(Math.random() * 20) + 65;
        
        setCpuData(prev => [...prev.slice(1), { 
          time: new Date().toLocaleTimeString().slice(0, 5), 
          value: newCpuValue 
        }]);
        
        setMemoryData(prev => [...prev.slice(1), { 
          time: new Date().toLocaleTimeString().slice(0, 5), 
          value: newMemoryValue 
        }]);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedSwitch]);

  return (
    <div className="space-y-6">
      {/* Switch Selection & Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Real-time Monitoring
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <label className="whitespace-nowrap font-medium">Monitor Switch:</label>
            <Select value={selectedSwitch} onValueChange={setSelectedSwitch}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a switch to monitor" />
              </SelectTrigger>
              <SelectContent>
                {switches.map((switch_) => (
                  <SelectItem key={switch_.id} value={switch_.id}>
                    {switch_.name} ({switch_.ip})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSwitch && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedSwitch ? (
        <>
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {cpuData[cpuData.length - 1]?.value}%
                </div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1% from last hour
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Memory Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {memoryData[memoryData.length - 1]?.value}%
                </div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.8% from last hour
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">42°C</div>
                <div className="text-xs text-slate-600 mt-1">Normal operating range</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Power Usage</CardTitle>
                <Zap className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">145W</div>
                <div className="text-xs text-slate-600 mt-1">of 300W capacity</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  CPU Usage Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'CPU Usage']} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-green-500" />
                  Memory Usage Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={memoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Memory Usage']} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Interface Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-500" />
                Interface Status & Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interfaceStats.map((interface_) => (
                  <div key={interface_.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium text-slate-800">{interface_.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={interface_.status === 'up' ? 'default' : 'secondary'}
                            className={interface_.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {interface_.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-slate-600">{interface_.speed}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">Utilization</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                interface_.utilization > 80 ? 'bg-red-500' : 
                                interface_.utilization > 60 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${interface_.utilization}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{interface_.utilization}%</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">Errors</p>
                        <div className="flex items-center gap-1 mt-1">
                          {interface_.errors > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                          <span className={`text-sm font-medium ${interface_.errors > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {interface_.errors}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Model:</span>
                  <span className="font-medium">DCS-7050SX3-48YC8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">EOS Version:</span>
                  <span className="font-medium">4.28.3M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Serial Number:</span>
                  <span className="font-medium">SSJ17120022</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Uptime:</span>
                  <span className="font-medium">45d 12h 34m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Boot Time:</span>
                  <span className="font-medium">2024-04-15 08:22:15</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hardware Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Power Supply 1:</span>
                  <Badge className="bg-green-100 text-green-800">OK</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Power Supply 2:</span>
                  <Badge className="bg-green-100 text-green-800">OK</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Fan Tray 1:</span>
                  <Badge className="bg-green-100 text-green-800">OK</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Fan Tray 2:</span>
                  <Badge className="bg-green-100 text-green-800">OK</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Temperature:</span>
                  <Badge className="bg-green-100 text-green-800">Normal</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Switch to Monitor</h3>
            <p className="text-gray-500">
              Choose a switch from the dropdown above to view real-time monitoring data, performance charts, and system status.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
