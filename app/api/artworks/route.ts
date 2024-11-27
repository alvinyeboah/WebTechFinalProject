import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiResponseType } from '@/types/api';
import { Artwork } from '@/types/artwork';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ArtworkRow extends Artwork, RowDataPacket {}

function createApiResponse<T>(
  status: number,
  data: T,
  error?: string
): ApiResponseType<T> {
  return {
    status,
    timestamp: new Date().toISOString(),
    data,
    error
  } as ApiResponseType<T>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let query = 'SELECT * FROM Artwork';
    const params = [];

    if (id) {
      query += ' WHERE id = ?';
      params.push(id);
    }

    query += ' ORDER BY created_at DESC';

    const [artworks] = await db.query<ArtworkRow[]>(query, params);

    if (id && !artworks.length) {
      return NextResponse.json(
        createApiResponse(404, null, 'Artwork not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(200, id ? artworks[0] : artworks)
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Internal server error'),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      images,
      artist,
      category,
      medium,
      dimensions,
      year,
      condition,
      startingPrice,
      reservePrice,
      auctionStart,
      auctionEnd
    } = body;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO Artwork (
        title, description, images, artist_id, category,
        medium, dimensions, year, condition, starting_price,
        reserve_price, auction_start, auction_end, status,
        current_price, views, favorites
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, 0, 0)`,
      [
        title,
        description,
        JSON.stringify(images),
        artist.id,
        category,
        medium,
        JSON.stringify(dimensions),
        year,
        condition,
        startingPrice,
        reservePrice,
        new Date(auctionStart),
        new Date(auctionEnd),
        startingPrice
      ]
    );

    const [newArtwork] = await db.query<ArtworkRow[]>(
      'SELECT * FROM Artwork WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json(
      createApiResponse(201, newArtwork[0]),
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Failed to create artwork'),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        createApiResponse(400, null, 'ID is required'),
        { status: 400 }
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'UPDATE Artwork SET ? WHERE id = ?',
      [body, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        createApiResponse(404, null, 'Artwork not found'),
        { status: 404 }
      );
    }

    const [updatedArtwork] = await db.query<ArtworkRow[]>(
      'SELECT * FROM Artwork WHERE id = ?',
      [id]
    );

    return NextResponse.json(
      createApiResponse(200, updatedArtwork[0])
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Failed to update artwork'),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        createApiResponse(400, null, 'ID is required'),
        { status: 400 }
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM Artwork WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        createApiResponse(404, null, 'Artwork not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createApiResponse(200, null)
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      createApiResponse(500, null, 'Failed to delete artwork'),
      { status: 500 }
    );
  }
}