import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { isAdmin } from '@/lib/auth';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        console.log('🛡️ Ban API hit for ID:', id);

        if (!(await isAdmin())) {
            console.log('❌ Unauthorized ban attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        console.log('📦 Ban API Body received:', body);

        const { isBanned } = body;
        console.log(`🔄 Updating ban status to: ${isBanned} (Type: ${typeof isBanned})`);

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            id,
            { isBanned: isBanned },
            { new: true }
        );

        if (!user) {
            console.log('❌ User not found for update');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('✅ User updated successfully:', user.email, 'New Status:', user.isBanned);

        return NextResponse.json({ message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`, user });
    } catch (error: any) {
        console.error('🔥 Ban API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
