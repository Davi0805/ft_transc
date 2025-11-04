export interface ProfileDataType {
    user_id: number;
    nickname: string;
    username: string;
    ranking: number;
    friendsCount: number;
    is_friend: boolean;
    is_blocked?: boolean;
}
