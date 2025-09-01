"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserTokenUsage } from '@/lib/firebase';
import { signOutUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Mail, Settings, CreditCard, BarChart3, Shield, Crown } from 'lucide-react';
import Link from 'next/link';

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');

  useEffect(() => {
    if (user) {
      loadUserPlan();
    }
  }, [user]);

  const loadUserPlan = async () => {
    try {
      const result = await getUserTokenUsage();
      if (result.success) {
        const data = result.data as any;
        setUserPlan(data.plan || 'free');
      }
    } catch (error) {
      console.error('Error loading user plan:', error);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOutUser();
    setLoading(false);
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const userInitials = getInitials(displayName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={displayName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/verify" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        {userPlan !== 'free' ? (
          <DropdownMenuItem asChild>
            <Link href="/usage" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Usage & Analytics</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild disabled>
            <span className="flex items-center text-muted-foreground">
              <BarChart3 className="mr-2 h-4 w-4" />
              Usage & Analytics (Pro+ Required)
            </span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link href="/billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing & Subscription</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
