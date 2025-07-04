
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Trash2, Plus, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('safesister-contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem('safesister-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide at least name and phone number",
        variant: "destructive"
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '', email: '', relationship: '' });
    setIsAdding(false);
    
    toast({
      title: "Contact Added",
      description: `${contact.name} has been added to your emergency contacts`,
    });
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed",
    });
  };

  const sendTestAlert = (contact: Contact) => {
    const message = `🚨 TEST ALERT from SafeSister 🚨\nThis is a test of your emergency contact system.\nContact: ${contact.name}\nTime: ${new Date().toLocaleString()}`;
    
    console.log(`Test alert sent to ${contact.name} (${contact.phone}):`, message);
    
    toast({
      title: "Test Alert Sent",
      description: `Test message sent to ${contact.name}`,
    });
  };

  return (
    <Card className="border-2 border-purple-200 bg-white/70 backdrop-blur-sm mb-6">
      <CardHeader>
        <CardTitle className="text-purple-700 flex items-center justify-between">
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Emergency Contacts ({contacts.length})
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Contact
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add New Contact Form */}
        {isAdding && (
          <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
            <h4 className="font-semibold text-purple-700 mb-3">Add New Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  placeholder="Friend, Family, etc."
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button onClick={addContact} size="sm">
                Add Contact
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No emergency contacts added yet.</p>
            <p className="text-sm">Add contacts to receive emergency alerts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 hover:shadow-md transition-all duration-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {contact.phone}
                        </span>
                        {contact.email && (
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </span>
                        )}
                        {contact.relationship && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            {contact.relationship}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => sendTestAlert(contact)}
                    size="sm" 
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Test
                  </Button>
                  <Button 
                    onClick={() => removeContact(contact.id)}
                    size="sm" 
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <strong>Note:</strong> In a real emergency, alerts would be sent via SMS and email to all your emergency contacts 
          with your location and timestamp. This demo shows console logs for testing purposes.
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
