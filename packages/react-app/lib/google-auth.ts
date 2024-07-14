"use server"

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle() {
    signIn("google")
}

export async function signOutWithGoogle() {
    signOut()
}