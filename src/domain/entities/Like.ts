export type LikeProps = {
  id: number | null;   
  userId: number;
  postId: number;
  createdAt: Date;
};

export class Like {
  private constructor(private props: LikeProps) {}

  public static create(userId: number, postId: number): Like {
    if (!userId || userId <= 0) throw new Error("User ID must be a positive number");
    if (!postId || postId <= 0) throw new Error("Post ID must be a positive number");

    return new Like({
      id: null,  
      userId,
      postId,
      createdAt: new Date(),
    });
  }

  public static with(props: LikeProps): Like {
    if (!props.userId || props.userId <= 0) throw new Error("User ID must be a positive number");
    if (!props.postId || props.postId <= 0) throw new Error("Post ID must be a positive number");

    return new Like({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
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

  public equals(other: Like): boolean {
    return this.userId === other.userId && this.postId === other.postId;
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
    };
  }
}
