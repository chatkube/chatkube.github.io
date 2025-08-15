import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Download } from "lucide-react";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  company_size?: string;
  role?: string;
  primary_devops_domain?: string;
  tech_stack?: string[];
  pain_points?: string;
  biggest_challenge?: string;
  team_size?: string;
  current_tools?: string[];
  budget_range?: string;
  timeline?: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'admin') {
      fetchWaitlistEntries();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  const fetchWaitlistEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching waitlist:', error);
        toast({
          title: "Error",
          description: "Failed to fetch waitlist entries",
          variant: "destructive",
        });
      } else {
        setWaitlistEntries(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Company Size', 'Role', 'Primary DevOps Domain', 'Tech Stack', 'Pain Points', 'Biggest Challenge', 'Team Size', 'Current Tools', 'Budget Range', 'Timeline', 'Date Joined'],
      ...waitlistEntries.map(entry => [
        entry.name,
        entry.email,
        entry.company_size || '',
        entry.role || '',
        entry.primary_devops_domain || '',
        (entry.tech_stack || []).join('; '),
        entry.pain_points || '',
        entry.biggest_challenge || '',
        entry.team_size || '',
        (entry.current_tools || []).join('; '),
        entry.budget_range || '',
        entry.timeline || '',
        new Date(entry.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatkube-enhanced-waitlist.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={signOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={signOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitlistEntries.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const domains = waitlistEntries
                    .map(entry => entry.primary_devops_domain)
                    .filter(Boolean);
                  const domainCounts = domains.reduce((acc, domain) => {
                    acc[domain!] = (acc[domain!] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const topDomain = Object.entries(domainCounts)
                    .sort(([,a], [,b]) => b - a)[0];
                  return topDomain ? topDomain[0] : 'N/A';
                })()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const challenges = waitlistEntries
                    .map(entry => entry.biggest_challenge)
                    .filter(Boolean);
                  const challengeCounts = challenges.reduce((acc, challenge) => {
                    acc[challenge!] = (acc[challenge!] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  const topChallenge = Object.entries(challengeCounts)
                    .sort(([,a], [,b]) => b - a)[0];
                  return topChallenge ? topChallenge[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A';
                })()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Company Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const sizes = waitlistEntries
                    .map(entry => entry.company_size)
                    .filter(Boolean);
                  if (sizes.length === 0) return 'N/A';
                  
                  const sizeMap: Record<string, number> = {
                    '1-10': 5,
                    '11-50': 30,
                    '51-200': 125,
                    '201-1000': 600,
                    '1000+': 1000
                  };
                  
                  const avgSize = sizes.reduce((sum, size) => sum + (sizeMap[size!] || 0), 0) / sizes.length;
                  return avgSize < 50 ? 'Small' : avgSize < 200 ? 'Medium' : 'Large';
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Waitlist Entries ({waitlistEntries.length})</CardTitle>
            <CardDescription>
              Manage your ChatKube waitlist subscribers with enhanced pain point data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {waitlistEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No waitlist entries yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlistEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.name}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>{entry.company_size || '-'}</TableCell>
                        <TableCell>{entry.role || '-'}</TableCell>
                        <TableCell>{entry.primary_devops_domain || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate" title={entry.biggest_challenge}>
                          {entry.biggest_challenge || '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(entry.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;