export type LikeProps = {
    id: number;
    userId: number;
    postId: number;
    createdAt: Date;
  }
  
  export class Like {
    private constructor(private props: LikeProps) {}
  
    public static create(userId: number, postId: number): Like {
      if (!userId) throw new Error("User ID is required");
      if (!postId) throw new Error("Post ID is required");
  
      return new Like({
        id: 0, // This should be set by the database
        userId,
        postId,
        createdAt: new Date(),
      });
    }
  
    public static with(props: LikeProps): Like {
      if (!props.userId) throw new Error("User ID is required");
      if (!props.postId) throw new Error("Post ID is required");
  
      return new Like(props);
    }
  
    public get id() {
      return this.props.id;
    }
  
    public get userId() {
      return this.props.userId;
    }
  
    public get postId() {
      return this.props.postId;
    }
  
    public get createdAt() {
      return this.props.createdAt;
    }
  }