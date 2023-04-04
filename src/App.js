import React, { Component } from "react";
import Post from "./components/Post";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.getPposts();
  }

  componentDidUpdate(prevProps, prevState) {
    const isEquilPosts = this.comparePosts(prevState.posts, this.state.posts);

    if (!isEquilPosts && !prevState.posts.length === 0) {
      this.getPposts();
    }
  }

  comparePosts = (a, b) => {
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }

    return true;
  };

  getPposts = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => this.setState({ posts: data }))
      .catch((error) => console.error(error));
  };

  deletePost = (id) => {
    document.body.style.overflow = "visible";

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        const newPosts = this.state.posts.filter((el) => el.id !== id);
        this.setState((prev) => ({ ...prev, posts: newPosts }));
      }
    });
  };

  editPost = (id, title, body) => {
    document.body.style.overflow = "visible";

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        title,
        body,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const newPosts = this.state.posts.map((post) =>
            post.id === data.id
              ? { ...post, title: data.title, body: data.body }
              : post
          );
          this.setState({ posts: newPosts });
        }
      });
  };

  render() {
    const { posts } = this.state;

    return (
      <div>
        <h1>Posts</h1>
        <ul>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              deletePost={this.deletePost}
              editPost={this.editPost}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
