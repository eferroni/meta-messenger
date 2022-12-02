import React from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Message } from "../typings";
import { unstable_getServerSession } from "next-auth/next";
import { Providers } from "./providers";

async function HomePage() {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
    }, 1000);
  });
  const session = await unstable_getServerSession();

  const data = await fetch(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api/getMessages`
  ).then((res) => res.json());

  const messages: Message[] = data.messages;

  return (
    // using providers instead of passing a session parameter
    <Providers session={session}>
      <main>
        <MessageList initialMessages={messages} />

        <ChatInput session={session} />
      </main>
    </Providers>
  );
}

export default HomePage;
