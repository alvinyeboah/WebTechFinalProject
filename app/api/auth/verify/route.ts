import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const token = req.cookies.get('token')?.value;
  
      if (!token) {
        return NextResponse.json(
          { authenticated: false },
          { status: 401 }
        );
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { authenticated: false },
          { status: 401 }
        );
      }
  
      const query = `
        SELECT id, email, username, firstName, lastName, userRole, createdAt, lastLogin
        FROM users 
        WHERE id = ?
      `;
      
      const [rows] = await db.query<any[]>(query, [decoded.id]);
      
      if (rows.length === 0) {
        return NextResponse.json(
          { authenticated: false },
          { status: 401 }
        );
      }
      const { password, ...userData } = rows[0];
      return NextResponse.json({
        authenticated: true,
        user: userData
      }, { status: 200 });
  
    } catch (error) {
      console.error('Verify session error:', error);
      return NextResponse.json({ 
        authenticated: false,
        error: 'Failed to verify session'
      }, { status: 401 });
    }
  }