// src/app/components/user-menu.tsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, User, Trophy, HelpCircle, House, BookOpen, Share2 } from "lucide-react";

type UserMenuProps = {
  onShowLeaderboard: () => void;
  onShowOnboarding?: () => void;
  onBackToMenu?: () => void;
  onOpenStudy?: () => void;
};

const handleChallengeFriend = () => {
  const message = encodeURIComponent(
    "Hey! I challenge you to beat my streak on VerbumFlow — a French verb conjugation game. Think you can keep up? 👊\n\nhttps://verbumflowapp.web.app"
  );
  window.open(`https://wa.me/?text=${message}`, "_blank");
};

export function UserMenu({ onShowLeaderboard, onShowOnboarding, onBackToMenu, onOpenStudy }: UserMenuProps) {
  const { user, signInWithGoogle, signOut, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
    );
  }

  if (isGuest) {
    return (
      <div className="flex gap-2">
        {onBackToMenu && (
          <Button
            onClick={onBackToMenu}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to menu"
          >
            <House className="h-5 w-5" />
          </Button>
        )}
        {onOpenStudy && (
          <Button
            onClick={onOpenStudy}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Study Mode"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        )}
        <Button
          onClick={handleChallengeFriend}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Challenge a friend"
        >
          <Share2 className="h-5 w-5" />
        </Button>
        {onShowOnboarding && (
          <Button
            onClick={onShowOnboarding}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="How to play"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        )}
        <Button
          onClick={onShowLeaderboard}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Leaderboard"
        >
          <Trophy className="h-5 w-5" />
        </Button>
        <Button
          onClick={signInWithGoogle}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign in</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {onBackToMenu && (
        <Button
          onClick={onBackToMenu}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Back to menu"
        >
          <House className="h-5 w-5" />
        </Button>
      )}
      {onOpenStudy && (
        <Button
          onClick={onOpenStudy}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="Study Mode"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
      )}
      <Button
        onClick={handleChallengeFriend}
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Challenge a friend"
      >
        <Share2 className="h-5 w-5" />
      </Button>
      {onShowOnboarding && (
        <Button
          onClick={onShowOnboarding}
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          title="How to play"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      )}
      <Button
        onClick={onShowLeaderboard}
        variant="ghost"
        size="icon"
        className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Leaderboard"
      >
        <Trophy className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10"
          >
            <Avatar className="h-9 w-9 border-2 border-white/30">
              <AvatarImage
                src={user?.photoURL ?? undefined}
                alt={user?.displayName ?? "User"}
              />
              <AvatarFallback className="bg-white/20 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
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
              <HelpCircle className="mr-2 h-4 w-4" />
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
    </div>
  );
}
