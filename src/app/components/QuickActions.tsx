import { Camera, Mic, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from './ui/card';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Camera,
      label: 'Scan Card',
      description: 'Capture business card',
      color: 'text-blue-500 bg-blue-500/10',
      onClick: () => navigate('/add'),
    },
    {
      icon: Mic,
      label: 'Voice Capture',
      description: 'Quick voice note',
      color: 'text-purple-500 bg-purple-500/10',
      onClick: () => navigate('/add'),
    },
    {
      icon: User,
      label: 'Manual Entry',
      description: 'Add contact manually',
      color: 'text-gray-500 bg-gray-500/10',
      onClick: () => navigate('/add'),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <Card 
          key={action.label}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={action.onClick}
        >
          <CardContent className="p-4 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <p className="font-medium text-sm mb-0.5">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
