import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Conversation {
  id: string;
  customer_id: string;
  agent_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  customer: {
    full_name: string;
    avatar_url?: string;
    email: string;
  };
  last_message?: {
    message: string;
    message_type: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url?: string;
  };
}

export function AgentDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('waiting');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, [activeTab]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('agent-chat')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${selectedConversation.id}`
          },
          () => {
            loadMessages(selectedConversation.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      let query = supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (activeTab === 'waiting') {
        query = query.eq('status', 'waiting');
      } else if (activeTab === 'my-chats') {
        query = query.eq('agent_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setConversations((data || []).map(conv => ({
        ...conv,
        customer: {
          full_name: 'Customer',
          email: 'customer@example.com',
          avatar_url: undefined
        }
      })));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(msg => ({
        ...msg,
        sender: {
          full_name: 'User',
          avatar_url: undefined
        }
      })));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const takeConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({
          agent_id: user.id,
          status: 'active'
        })
        .eq('id', conversationId);

      if (error) throw error;

      // Send system message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message: `${user.user_metadata?.full_name || user.email || 'Agent'} has joined the conversation.`,
          message_type: 'system'
        });

      loadConversations();
      toast({
        title: "Conversation taken",
        description: "You are now handling this customer's request.",
      });
    } catch (error) {
      console.error('Error taking conversation:', error);
      toast({
        title: "Error",
        description: "Failed to take conversation.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          message: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const closeConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ status: 'closed' })
        .eq('id', conversationId);

      if (error) throw error;

      loadConversations();
      setSelectedConversation(null);
      toast({
        title: "Conversation closed",
        description: "The conversation has been marked as resolved.",
      });
    } catch (error) {
      console.error('Error closing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to close conversation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
        <p className="text-muted-foreground">Manage customer support conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="waiting">Waiting</TabsTrigger>
                  <TabsTrigger value="my-chats">My Chats</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <ScrollArea className="h-96">
                    <div className="space-y-2 p-2">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-accent ${
                            selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={conversation.customer.avatar_url} />
                              <AvatarFallback>
                                {conversation.customer.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">
                                  {conversation.customer.full_name}
                                </p>
                                <Badge
                                  variant={
                                    conversation.status === 'waiting'
                                      ? 'destructive'
                                      : conversation.status === 'active'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {conversation.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {format(new Date(conversation.last_message_at), 'MMM d, HH:mm')}
                              </p>
                            </div>
                          </div>
                          {activeTab === 'waiting' && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                takeConversation(conversation.id);
                              }}
                              size="sm"
                              className="w-full mt-2"
                            >
                              Take Conversation
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.customer.avatar_url} />
                    <AvatarFallback>
                      {selectedConversation.customer.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {selectedConversation.customer.full_name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.customer.email}
                    </p>
                  </div>
                </div>
                {selectedConversation.status === 'active' && (
                  <Button
                    onClick={() => closeConversation(selectedConversation.id)}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="flex flex-col h-96">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex items-start gap-2 max-w-[80%] ${
                            message.sender_id === user?.id ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={message.sender.avatar_url} />
                            <AvatarFallback>
                              {message.sender.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              message.sender_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : message.message_type === 'system'
                                ? 'bg-muted text-muted-foreground italic'
                                : 'bg-secondary'
                            }`}
                          >
                            {message.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {selectedConversation.status === 'active' && selectedConversation.agent_id === user?.id && (
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your response..."
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Select a conversation</p>
                <p className="text-muted-foreground">
                  Choose a customer conversation to start helping
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}