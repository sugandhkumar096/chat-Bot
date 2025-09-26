import React from "react"
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

function formatTime(date = new Date()) {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

 function App() {
	const [messages, setMessages] = useState([
		{ id: crypto.randomUUID(), role: 'bot', text: 'Hi! How can I help you today?', time: formatTime() }
	]);
	const [input, setInput] = useState('');
	const [sending, setSending] = useState(false);
	const listRef = useRef(null);

	useEffect(() => {
		const el = listRef.current;
		if (!el) return;
		el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
	}, [messages]);

	const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

	const handleSend = async () => {
		if (!canSend) return;

		const userMsg = {
			id: crypto.randomUUID(),
			role: 'user',
			text: input.trim(),
			time: formatTime()
		};

		setMessages(prev => [...prev, userMsg]);
		setInput('');
		setSending(true);

		// Simulate bot response (replace with real API call)
		await new Promise(r => setTimeout(r, 600));

		const botMsg = {
			id: crypto.randomUUID(),
			role: 'bot',
			text: `You said: "${userMsg.text}"`,
			time: formatTime()
		};

		setMessages(prev => [...prev, botMsg]);
		setSending(false);
	};

	const onKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="chat-root">
			<header className="chat-header">
				<div className="chat-title">Assistant</div>
				<div className="chat-status">
					<span className={`dot ${sending ? 'dot-typing' : ''}`} />
					{sending ? 'Assistant is typing…' : 'Online'}
				</div>
			</header>

			<div ref={listRef} className="chat-list" role="log" aria-live="polite">
				{messages.map(m => (
					<MessageBubble key={m.id} role={m.role} text={m.text} time={m.time} />
				))}
			</div>

			<form
				className="chat-inputbar"
				onSubmit={(e) => {
					e.preventDefault();
					handleSend();
				}}
			>
				<input
					className="chat-input"
					type="text"
					placeholder="Type your message…"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={onKeyDown}
					aria-label="Message input"
				/>
				<button className="chat-send" type="submit" disabled={!canSend}>
					{sending ? 'Sending…' : 'Send'}
				</button>
			</form>
		</div>
	);
}

function MessageBubble({ role, text, time }) {
	const isUser = role === 'user';
	return (
		<div className={`msg-row ${isUser ? 'right' : 'left'}`}>
			<div className="avatar" aria-hidden="true">{isUser ? '👤' : '🤖'}</div>
			<div className={`bubble ${isUser ? 'user' : 'bot'}`}>
				<p className="bubble-text">{text}</p>
				<div className="meta">{time}</div>
			</div>
		</div>
	);
}

export default App
