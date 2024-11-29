export type PostProps = {
    id: number;
    title: string;
    content: string;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    likes?: number;
  }
  
  export class Post {
    private constructor(private props: PostProps) {}
  
    public static create(title: string, content: string, authorId: number): Post {
      if (!title) throw new Error("Title is required");
      if (!content) throw new Error("Content is required");
      if (!authorId) throw new Error("Author ID is required");
  
      return new Post({
        id: 0, // This should be set by the database
        title,
        content,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      });
    }
  
    public static with(props: PostProps): Post {
      return new Post(props);
    }
  
    public get id() {
      return this.props.id;
    }
  
    public get title() {
      return this.props.title;
    }
  
    public get content() {
      return this.props.content;
    }
  
    public get authorId() {
      return this.props.authorId;
    }
  
    public get createdAt() {
      return this.props.createdAt;
    }
  
    public get updatedAt() {
      return this.props.updatedAt;
    }
  
    public get deleted() {
      return this.props.deleted;
    }
  
    public updateTitle(title: string) {
      if (!title) throw new Error("Title cannot be empty");
      this.props.title = title;
      this.props.updatedAt = new Date();
    }
  
    public updateContent(content: string) {
      if (!content) throw new Error("Content cannot be empty");
      this.props.content = content;
      this.props.updatedAt = new Date();
    }
  
    public softDelete() {
      this.props.deleted = true;
      this.props.updatedAt = new Date();
    }
  
    public unDelete() {
      this.props.deleted = false;
      this.props.updatedAt = new Date();
    }
  
    public calculatePopularity(totalUsers: number, totalLikes: number): number {
      if (totalUsers <= 1) return 0; // Evita divisiones por 0
      return Number(((totalLikes / (totalUsers - 1)) * 100).toFixed(2));
    }
  
    public enrichDetails(authorName: string, popularity: number): Record<string, any> {
      return {
        id: this.props.id,
        title: this.props.title,
        content: this.props.content,
        author: authorName,
        popularity,
        createdAt: this.props.createdAt,
        updatedAt: this.props.updatedAt,
      };
    }
  }