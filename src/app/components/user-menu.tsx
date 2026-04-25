// src/app/components/user-menu.tsx
"use client";

import React from "react";
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
import { type LucideIcon, LogIn, LogOut, User, Trophy, CircleHelp, House, BookOpen, Share2 } from "lucide-react";

type ActiveScreen = "home" | "leaderboard" | "study" | "help";

type UserMenuProps = {
  onShowLeaderboard: () => void;
  onShowOnboarding?: () => void;
  onBackToMenu?: () => void;
  onOpenStudy?: () => void;
  activeScreen?: ActiveScreen;
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
}: UserMenuProps) {
  const { user, signInWithGoogle, signOut, isGuest, loading } = useAuth();

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
        <div className="flex justify-center gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-11 w-11 rounded-full bg-white/10 animate-pulse" />
          ))}
        </div>
        <div className="fixed top-3 right-3 z-50 h-10 w-10 rounded-full bg-white/20 animate-pulse" />
      </>
    );
  }

  const navRow = (
    <div className="flex justify-center gap-8">
      {navItems.map(({ icon: Icon, label, onClick, screen }) => {
        if (!onClick) return null;
        const isActive = screen !== undefined && activeScreen === screen;
        return (
          <button
            key={label}
            onClick={onClick}
            className="p-3 rounded-full text-white hover:bg-white/10 transition-colors"
            style={{ opacity: isActive ? 1 : 0.4 }}
            title={label}
            aria-label={label}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );

  const avatarEl = isGuest ? (
    <button
      onClick={signInWithGoogle}
      className="fixed top-3 right-3 z-50 h-10 w-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
      title="Sign in with Google"
      aria-label="Sign in with Google"
    >
      <LogIn size={20} />
    </button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="fixed top-3 right-3 z-50 h-10 w-10 rounded-full border-2 border-white/30 overflow-hidden hover:border-white/60 transition-colors focus:outline-none"
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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
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
