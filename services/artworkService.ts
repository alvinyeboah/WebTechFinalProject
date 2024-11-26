import { Artwork, ArtworkCategory } from "@/types/artwork";

// services/artworkService.ts
export class ArtworkService {
    private sources = {
      AIC: 'https://api.artic.edu/api/v1',
      MET: 'https://collectionapi.metmuseum.org/public/collection/v1'
    };
  
    private async searchAIC(query: string) {
      try {
        const response = await fetch(
          `${this.sources.AIC}/artworks/search?q=${encodeURIComponent(query)}&limit=20&fields=id,title,artist_display,description,image_id,date_display,medium_display,dimensions`
        );
        const data = await response.json();
        
        return data.data.filter((item: any) => item.image_id).map((item: any) => ({
          id: `AIC_${item.id}`,
          title: item.title,
          artist: item.artist_display,
          description: item.description,
          images: {
            url: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
            main: `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
          },
          source: 'AIC',
          year: item.date_display,
          medium: item.medium_display,
          dimensions: item.dimensions,
          currentPrice: 0,
          artwork_id: `AIC_${item.id}`
        }));
      } catch (error) {
        console.error('AIC API Error:', error);
        return [];
      }
    }
  
    private async searchMET(query: string) {
      try {
        const searchResponse = await fetch(
          `${this.sources.MET}/search?q=${encodeURIComponent(query)}&hasImages=true`
        );
        const searchData = await searchResponse.json();
        
        const objectIds = searchData.objectIDs?.slice(0, 20) || [];
        const objectPromises = objectIds.map((id:any) =>
          fetch(`${this.sources.MET}/objects/${id}`).then(res => res.json())
        );
        
        const objects = await Promise.all(objectPromises);
        
        return objects
          .filter(item => item.primaryImage || item.primaryImageSmall)
          .map(item => ({
            id: `MET_${item.objectID}`,
            title: item.title,
            artist: item.artistDisplayName || item.culture || 'Unknown Artist',
            description: item.description || `${item.objectName} from ${item.period || item.culture || 'unknown period'}`,
            images: {
              main: item.primaryImage || item.primaryImageSmall,
              url: item.primaryImage || item.primaryImageSmall,
              thumbnails: item.additionalImages
            },
            source: 'MET',
            year: item.objectDate,
            medium: item.medium,
            dimensions: item.dimensions,
            currentPrice: 0,
            artwork_id: `MET_${item.objectID}`
          }));
      } catch (error) {
        console.error('MET API Error:', error);
        return [];
      }
    }
  
    private mapCategory(classification: string): ArtworkCategory {
      const categoryMap: Record<string, ArtworkCategory> = {
        'Paintings': 'PAINTING',
        'Sculpture': 'SCULPTURE',
        'Photographs': 'PHOTOGRAPHY',
        'Prints': 'PRINT',
        'Digital': 'DIGITAL',
        'Mixed Media': 'MIXED_MEDIA'
      };
      
      return categoryMap[classification] || 'OTHER';
    }
  
    async searchArtworks(query: string) {
      const [aicResults, metResults] = await Promise.all([
        this.searchAIC(query),
        this.searchMET(query)
      ]);
      
      return [...aicResults, ...metResults];
    }
  
    async getArtworkDetails(id: string) {
      const [source, originalId] = id.split('_');
      
      switch(source) {
        case 'AIC':
          return this.getAICArtwork(originalId);
        case 'MET':
          return this.getMETArtwork(originalId);
        default:
          throw new Error('Unsupported source');
      }
    }
  
    private async getAICArtwork(id: string) {
      const response = await fetch(`${this.sources.AIC}/artworks/${id}`);
      const data = await response.json();
      return this.transformToArtwork(data.data, 'AIC');
    }
  
    private async getMETArtwork(id: string) {
      const response = await fetch(`${this.sources.MET}/objects/${id}`);
      const data = await response.json();
      return this.transformToArtwork(data, 'MET');
    }
  
    private transformToArtwork(data: any, source: 'AIC' | 'MET'): Artwork {
      return {
        artwork_id: data.id,
        title: data.title,
        description: data.description || '',
        artist: {
          id: `${source}_ARTIST_${data.id}`,
          name: source === 'AIC' ? data.artist_display : data.artistDisplayName,
        },
        images: {
          main: source === 'AIC' 
            ? `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`
            : data.primaryImage,
          url: source === 'AIC'
            ? `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`
            : data.primaryImage,
        },
        category: 'OTHER',
        medium: data.medium || 'Unknown',
        year: data.date_display || data.objectDate || 'Unknown',
        condition: 'GOOD',
        currentPrice: 0,
        startingPrice: 0,
        status: 'ACTIVE',
        bids: [],
        views: 0,
        favorites: 0,
        auctionStart: new Date(),
        auctionEnd: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        source: source
      };
    }
  }