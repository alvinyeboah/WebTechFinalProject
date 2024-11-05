export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    data?: Record<string, any>;
    createdAt: Date;
  }
  
  export type NotificationType =
    | 'BID_PLACED'
    | 'BID_OUTBID'
    | 'AUCTION_ENDING'
    | 'AUCTION_WON'
    | 'AUCTION_LOST'
    | 'PAYMENT_RECEIVED'
    | 'SYSTEM';
  