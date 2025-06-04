import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_SCENARIOS } from '@/api/mockAuth';
import { Copy, CheckCircle } from 'lucide-react';

export function DemoHelper() {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          🎭 Demo Helper - Email Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-blue-700 mb-2">
            📝 Signup Scenarios:
          </h3>
          <div className="grid gap-2">
            {Object.entries(DEMO_SCENARIOS.signup).map(([key, scenario]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <div className="flex-1">
                  <Badge variant="outline" className="mr-2">
                    {key}
                  </Badge>
                  <span className="text-sm">{scenario.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {scenario.email}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(scenario.email)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedText === scenario.email ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-blue-700 mb-2">
            🔐 Login Scenarios:
          </h3>
          <div className="grid gap-2">
            {Object.entries(DEMO_SCENARIOS.login).map(([key, scenario]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <div className="flex-1">
                  <Badge variant="outline" className="mr-2">
                    {key}
                  </Badge>
                  <span className="text-sm">{scenario.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {scenario.email}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(scenario.email)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedText === scenario.email ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
          💡 Click the copy button to copy email addresses for testing. Use any
          password for demo purposes.
        </div>
      </CardContent>
    </Card>
  );
}
