import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { Loader2, Mic, Paperclip, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DashboardPage() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        activeConversationId,
        conversations,
        createConversation,
        addMessage,
        getActiveConversation,
    } = useChatStore();
    const activeConversation = getActiveConversation();

    useEffect(() => {
        // Create initial conversation only if no conversations exist at all
        if (conversations.length === 0) {
            createConversation();
        }
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);

    const handleSend = async () => {
        if (!input.trim() || !activeConversationId) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        // Add user message
        addMessage(activeConversationId, {
            role: 'user',
            content: userMessage,
        });

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            addMessage(activeConversationId, {
                role: 'assistant',
                content:
                    "I'm Nexi, your AI assistant. This is a demo response. In production, I'll be powered by your RAG, MCP, and plugin systems to provide intelligent, context-aware responses.",
            });
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const hasMessages = activeConversation && activeConversation.messages.length > 0;

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-custom px-4 py-6">
                {!hasMessages ? (
                    /* Welcome State */
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>

                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
                            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Welcome to Nexi AI
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground">
                                How can I help?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                            {[
                                'Explain quantum computing',
                                'Write a Python function',
                                'Translate this to Spanish',
                                'Generate an image description',
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="group px-5 py-4 text-sm text-left rounded-xl border border-border/40 hover:border-primary/60 hover:bg-card/60 transition-all duration-200 backdrop-blur-sm"
                                >
                                    <span className="text-foreground/90 group-hover:text-foreground">
                                        {suggestion}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Messages */
                    <div className="space-y-6 px-4 py-6">
                        {activeConversation.messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300',
                                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                )}
                            >
                                <Avatar
                                    className={cn(
                                        'h-8 w-8 border-2',
                                        message.role === 'user'
                                            ? 'border-primary/20'
                                            : 'border-primary/40'
                                    )}
                                >
                                    <AvatarFallback
                                        className={cn(
                                            message.role === 'user'
                                                ? 'bg-gradient-to-br from-primary/20 to-primary/10 text-foreground'
                                                : 'bg-gradient-to-br from-primary to-primary/60 text-white'
                                        )}
                                    >
                                        {message.role === 'user' ? (
                                            'U'
                                        ) : (
                                            <Sparkles className="h-4 w-4" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>

                                <div
                                    className={cn(
                                        'flex-1 px-4 py-3 rounded-2xl max-w-[80%]',
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground ml-auto'
                                            : 'bg-card border border-border/50'
                                    )}
                                >
                                    <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-4 animate-in fade-in duration-300">
                                <Avatar className="h-8 w-8 border-2 border-primary/40">
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60">
                                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 px-4 py-3 rounded-2xl max-w-[80%] bg-card border border-border/50">
                                    <div className="flex gap-1">
                                        <span
                                            className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                                            style={{ animationDelay: '0ms' }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                                            style={{ animationDelay: '150ms' }}
                                        />
                                        <span
                                            className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                                            style={{ animationDelay: '300ms' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 pb-8">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex gap-2 items-end bg-card backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-3 shadow-2xl shadow-black/50">
                        {/* Attachment Button */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground rounded-xl"
                            disabled={isLoading}
                        >
                            <Paperclip className="h-5 w-5" />
                        </Button>

                        {/* Input Field */}
                        <div className="flex-1 relative">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message Nexi..."
                                className="min-h-10 max-h-32 resize-none pr-11 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Voice Button */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground rounded-xl"
                            disabled={isLoading}
                        >
                            <Mic className="h-5 w-5" />
                        </Button>

                        {/* Send Button */}
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-xl"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
