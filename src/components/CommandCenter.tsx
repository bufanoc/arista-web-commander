
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Terminal, 
  Play, 
  History, 
  Save, 
  Download,
  Upload,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface CommandCenterProps {
  switches: Switch[];
}

interface CommandResult {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
  switchName: string;
  status: 'success' | 'error';
  executionTime: number;
}

export const CommandCenter = ({ switches }: CommandCenterProps) => {
  const [selectedSwitch, setSelectedSwitch] = useState<string>("");
  const [command, setCommand] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandResult[]>([
    {
      id: "1",
      command: "show version",
      output: `Arista DCS-7050SX3-48YC8-F
Hardware version: 11.00
Deviations: 
Serial number: SSJ17120022
System MAC address: 001c.73a0.fc18

Software image version: 4.28.3M-26379303.4283M
Architecture: i686
Internal build version: 4.28.3M-26379303.4283M
Internal build ID: fed9e33b-669c-42ea-9408-4c16a4eadf5a
Image format version: 1.0
Image optimization: None

Uptime: 45 days, 12 hours and 34 minutes
Total memory: 8155904 kB
Free memory: 5420516 kB`,
      timestamp: new Date(Date.now() - 300000),
      switchName: "Core-Switch-01",
      status: 'success',
      executionTime: 0.8
    },
    {
      id: "2", 
      command: "show interfaces status",
      output: `Port      Name               Status       Vlan       Duplex Speed Type             Flags Encapsulation
Et1                          connected    1          full   10G    10GBASE-SR       
Et2                          connected    1          full   10G    10GBASE-SR       
Et3                          notconnect   1          auto   auto   10GBASE-SR       
Et4                          connected    1          full   10G    10GBASE-SR       
Ma1                          connected    routed     full   1000   10/100/1000`,
      timestamp: new Date(Date.now() - 180000),
      switchName: "Core-Switch-01", 
      status: 'success',
      executionTime: 1.2
    }
  ]);
  const [scriptContent, setScriptContent] = useState("");
  const { toast } = useToast();

  const quickCommands = [
    { name: "Show Version", command: "show version" },
    { name: "Show Interfaces", command: "show interfaces status" },
    { name: "Show IP Routes", command: "show ip route" },
    { name: "Show VLANs", command: "show vlan" },
    { name: "Show MAC Table", command: "show mac address-table" },
    { name: "Show Running Config", command: "show running-config" },
    { name: "Show System Resources", command: "show processes top" },
    { name: "Show BGP Summary", command: "show ip bgp summary" }
  ];

  const executeCommand = async () => {
    if (!selectedSwitch || !command.trim()) {
      toast({
        title: "Error",
        description: "Please select a switch and enter a command",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    const startTime = Date.now();
    
    // Simulate API call to switch
    setTimeout(() => {
      const executionTime = (Date.now() - startTime) / 1000;
      const switchName = switches.find(s => s.id === selectedSwitch)?.name || "Unknown";
      
      // Mock different responses based on command
      let mockOutput = "";
      let status: 'success' | 'error' = 'success';
      
      if (command.includes("show version")) {
        mockOutput = `Arista DCS-7050SX3-48YC8-F
Hardware version: 11.00
Serial number: SSJ17120022
Software image version: 4.28.3M
Architecture: i686
Uptime: 45 days, 12 hours and 34 minutes
Total memory: 8155904 kB
Free memory: 5420516 kB`;
      } else if (command.includes("show interfaces")) {
        mockOutput = `Port      Name               Status       Vlan       Duplex Speed Type             
Et1                          connected    1          full   10G    10GBASE-SR       
Et2                          connected    1          full   10G    10GBASE-SR       
Et3                          notconnect   1          auto   auto   10GBASE-SR       
Et48                         connected    20         full   10G    10GBASE-SR       
Ma1                          connected    routed     full   1000   10/100/1000`;
      } else if (command.includes("show vlan")) {
        mockOutput = `VLAN  Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1     default                          active    Et1, Et2, Et3, Et4, Et5, Et6
10    Management                       active    
20    Production                       active    Et48
30    Guest                            active    `;
      } else if (command.includes("invalid") || command.includes("error")) {
        mockOutput = "% Invalid command or syntax error";
        status = 'error';
      } else {
        mockOutput = `Command executed successfully: ${command}
Output would appear here in a real implementation.
This is a simulated response for demonstration purposes.`;
      }

      const result: CommandResult = {
        id: Date.now().toString(),
        command,
        output: mockOutput,
        timestamp: new Date(),
        switchName,
        status,
        executionTime
      };

      setCommandHistory(prev => [result, ...prev]);
      setCommand("");
      setIsExecuting(false);
      
      toast({
        title: status === 'success' ? "Command Executed" : "Command Failed",
        description: `Executed on ${switchName} in ${executionTime}s`,
        variant: status === 'error' ? "destructive" : "default"
      });
    }, Math.random() * 2000 + 500); // Random delay between 0.5-2.5s
  };

  const executeScript = async () => {
    if (!selectedSwitch || !scriptContent.trim()) {
      toast({
        title: "Error", 
        description: "Please select a switch and enter script content",
        variant: "destructive"
      });
      return;
    }

    const commands = scriptContent.split('\n').filter(cmd => cmd.trim());
    
    for (const cmd of commands) {
      if (cmd.trim()) {
        setCommand(cmd.trim());
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Simulate executing each command
      }
    }
    
    toast({
      title: "Script Executed",
      description: `Executed ${commands.length} commands successfully`
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Output copied to clipboard"
    });
  };

  const clearHistory = () => {
    setCommandHistory([]);
    toast({
      title: "History Cleared",
      description: "Command history has been cleared"
    });
  };

  return (
    <div className="space-y-6">
      {/* Switch Selection & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-500" />
            Command Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <label className="whitespace-nowrap font-medium">Target Switch:</label>
            <Select value={selectedSwitch} onValueChange={setSelectedSwitch}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a switch to execute commands" />
              </SelectTrigger>
              <SelectContent>
                {switches.map((switch_) => (
                  <SelectItem key={switch_.id} value={switch_.id}>
                    {switch_.name} ({switch_.ip}) - {switch_.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSwitch && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="interactive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interactive">Interactive CLI</TabsTrigger>
          <TabsTrigger value="scripts">Script Execution</TabsTrigger>
          <TabsTrigger value="history">Command History</TabsTrigger>
        </TabsList>

        {/* Interactive CLI */}
        <TabsContent value="interactive">
          <div className="space-y-6">
            {/* Quick Commands */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {quickCommands.map((qCmd) => (
                    <Button
                      key={qCmd.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setCommand(qCmd.command)}
                      className="justify-start text-left h-auto py-2"
                    >
                      <div>
                        <div className="font-medium text-xs">{qCmd.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{qCmd.command}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Command Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Execute Command</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 font-mono text-sm bg-slate-100 px-3 py-2 rounded border flex items-center">
                    <span className="text-blue-600 mr-2">
                      {switches.find(s => s.id === selectedSwitch)?.name || 'switch'}#
                    </span>
                    <Input
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="Enter EOS command..."
                      className="border-0 bg-transparent p-0 font-mono focus-visible:ring-0"
                      onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                    />
                  </div>
                  <Button 
                    onClick={executeCommand} 
                    disabled={isExecuting || !selectedSwitch}
                    className="px-6"
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-slate-500">
                  Press Enter to execute command or click the Execute button
                </div>
              </CardContent>
            </Card>

            {/* Latest Command Result */}
            {commandHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Latest Result</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={commandHistory[0].status === 'success' ? 'default' : 'destructive'}>
                        {commandHistory[0].status === 'success' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {commandHistory[0].status}
                      </Badge>
                      <Badge variant="secondary">
                        {commandHistory[0].executionTime}s
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-mono font-medium">
                        {commandHistory[0].switchName}# {commandHistory[0].command}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(commandHistory[0].output)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
{commandHistory[0].output}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Script Execution */}
        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Script Execution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Script Content (one command per line):
                </label>
                <Textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder={`show version
show interfaces status
show vlan
show ip route summary`}
                  rows={10}
                  className="font-mono"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={executeScript} disabled={!selectedSwitch} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Execute Script
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Load Script
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Script
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Command History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Command History
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commandHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No command history yet</p>
                    <p className="text-sm">Execute some commands to see them here</p>
                  </div>
                ) : (
                  commandHistory.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                            {result.status === 'success' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {result.status}
                          </Badge>
                          <span className="font-mono text-sm font-medium">
                            {result.switchName}# {result.command}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4" />
                          {result.timestamp.toLocaleString()}
                          <Badge variant="secondary">{result.executionTime}s</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.output)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <pre className="bg-slate-50 p-3 rounded text-sm overflow-x-auto font-mono whitespace-pre-wrap border">
{result.output}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
