// src/app/components/user-menu.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  type LucideIcon,
  LogIn,
  LogOut,
  User,
  Users,
  Trophy,
  CircleHelp,
  House,
  BookOpen,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { buildWhatsAppInvite } from "@/lib/utils";

type ActiveScreen = "home" | "leaderboard" | "study" | "help";

type UserMenuProps = {
  onShowLeaderboard: () => void;
  onShowOnboarding?: () => void;
  onBackToMenu?: () => void;
  onOpenStudy?: () => void;
  activeScreen?: ActiveScreen;
  friendCode?: string;
  friendsPanelOpen?: boolean;
  setFriendsPanelOpen?: (open: boolean) => void;
  pendingRequestCount?: number;
};

const handleChallengeFriend = () => {
  const message = encodeURIComponent(
    "Hey! I challenge you to beat my streak on VerbumFlow — a French verb conjugation game. Think you can keep up? 👊\n\nhttps://verbumflowapp.web.app"
  );
  window.open(`https://wa.me/?text=${message}`, "_blank");
};

export function UserMenu({
  onShowLeaderboard,
  onShowOnboarding,
  onBackToMenu,
  onOpenStudy,
  activeScreen = "home",
  friendCode = "",
  friendsPanelOpen = false,
  setFriendsPanelOpen,
  pendingRequestCount = 0,
}: UserMenuProps) {
  const { user, signInWithGoogle, signOut, isGuest, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!friendCode) return;
    navigator.clipboard.writeText(friendCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const navItems: Array<{
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    screen?: ActiveScreen;
  }> = [
    { icon: House, label: "Home", onClick: onBackToMenu, screen: "home" },
    { icon: BookOpen, label: "Study Mode", onClick: onOpenStudy, screen: "study" },
    { icon: Share2, label: "Challenge a friend", onClick: handleChallengeFriend },
    { icon: CircleHelp, label: "How to play", onClick: onShowOnboarding, screen: "help" },
    { icon: Trophy, label: "Leaderboard", onClick: onShowLeaderboard, screen: "leaderboard" },
  ];

  if (loading) {
    return (
      <>
        <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-3 px-3 sm:gap-4 sm:px-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-11 w-11 rounded-full bg-white/10 animate-pulse" />
          ))}
        </div>
        <div
          className="fixed z-50 h-11 w-11 rounded-full bg-white/20 animate-pulse"
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 12px)",
            right: "calc(env(safe-area-inset-right, 0px) + 12px)",
          }}
        />
      </>
    );
  }

  const navRow = (
    <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-3 px-3 sm:gap-4 sm:px-4">
      {navItems.map(({ icon: Icon, label, onClick, screen }) => {
        if (!onClick) return null;
        const isActive = screen !== undefined && activeScreen === screen;
        return (
          <button
            key={label}
            onClick={onClick}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
            style={{ opacity: isActive ? 1 : 0.4 }}
            title={label}
            aria-label={label}
          >
            <Icon size={20} />
          </button>
        );
      })}

      {/* Friends button with pending badge — signed-in only */}
      {user && setFriendsPanelOpen && (
        <div className="relative">
          <button
            onClick={() => setFriendsPanelOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
            style={{ opacity: friendsPanelOpen ? 1 : 0.4 }}
            title="Friends"
            aria-label="Friends"
          >
            <Users size={20} />
          </button>
          {pendingRequestCount > 0 && (
            <span
              className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px] font-bold pointer-events-none"
              style={{ backgroundColor: "#FF6A4D" }}
            >
              {pendingRequestCount > 9 ? "9+" : pendingRequestCount}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const avatarEl = isGuest ? (
    <button
      onClick={signInWithGoogle}
      className="fixed z-50 flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 12px)",
        right: "calc(env(safe-area-inset-right, 0px) + 12px)",
      }}
      title="Sign in with Google"
      aria-label="Sign in with Google"
    >
      <LogIn size={20} />
    </button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="fixed z-50 h-11 w-11 overflow-hidden rounded-full border-2 border-white/30 transition-colors hover:border-white/60 focus:outline-none"
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 12px)",
            right: "calc(env(safe-area-inset-right, 0px) + 12px)",
          }}
          title={user?.displayName ?? "Account"}
          aria-label="Account menu"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user?.photoURL ?? undefined}
              alt={user?.displayName ?? "User"}
            />
            <AvatarFallback className="bg-white/20 text-white">
              <User size={14} />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>

        {/* Friend code block */}
        {friendCode && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <p
                className="text-xs uppercase mb-1.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "4px",
                  opacity: 0.5,
                }}
              >
                MY CODE
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="font-mono font-bold text-sm rounded-md px-3 py-1"
                  style={{ backgroundColor: "#FAFAF7", color: "#0B1020" }}
                >
                  {friendCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md text-white/60 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => window.open(buildWhatsAppInvite(friendCode), "_blank")}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: "#FF6A4D" }}
                  title="Invite a friend via WhatsApp"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onShowLeaderboard}>
          <Trophy className="mr-2 h-4 w-4" />
          Leaderboard
        </DropdownMenuItem>
        {onShowOnboarding && (
          <DropdownMenuItem onClick={onShowOnboarding}>
            <CircleHelp className="mr-2 h-4 w-4" />
            How to Play
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {navRow}
      {avatarEl}
    </>
  );
}
