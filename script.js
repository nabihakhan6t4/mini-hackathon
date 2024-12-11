import { db, auth, collection, getDocs, addDoc, deleteDoc, doc } from "./firebase.js";

const createPostForm = document.getElementById("createPostForm");
const postsContainer = document.getElementById("display-posts");

// Display Posts
// Display Posts
const displayPosts = async () => {
  if (!postsContainer) {
    console.error("Error: postsContainer not found!");
    return;
  }

  postsContainer.innerHTML = ""; // Clear existing posts

  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement("div");
      postElement.classList.add(
        "container",
        "d-flex",
        "flex-column",
        "displayPost",
        "mt-5"
      );

      const formattedDate = post.timestamp.toDate().toLocaleDateString();
      postElement.setAttribute('data-title', post.title);  // Ensure data-title is set

      postElement.innerHTML = `
        <h6 class="blog-topics-color mb-3">${formattedDate}</h6>
        <h2>${post.title}</h2>
        <p class="mt-2" id="blogs-paragraph">${post.content}</p>
        <div class="d-flex flex-row gap-3 align-items-center">
          <p>By ${post.userId}</p>
          <p class="blog-topics-color mb-3">7 mins read</p>
          ${
            post.userId === auth.currentUser?.uid
              ? ` 
                <button class="delete-btn" data-id="${doc.id}">Delete</button>
                <button class="edit-btn" data-id="${doc.id}" data-title="${post.title}" data-content="${post.content}">Edit</button>
              `
              : ""
          }
        </div>
      `;
      postsContainer.appendChild(postElement);
    });

    // Attach event listeners after posts are displayed
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.getAttribute('data-id');
        deletePost(postId);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.getAttribute('data-id');
        const postTitle = e.target.getAttribute('data-title');
        const postContent = e.target.getAttribute('data-content');
        editPost(postId, postTitle, postContent);
      });
    });

  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
};





// Search Blogs
const searchBlogs = () => {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const posts = document.querySelectorAll(".displayPost");

  posts.forEach((post) => {
    const postTitle = post.getAttribute("data-title").toLowerCase();
    if (postTitle.includes(searchTerm)) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
};

// Initialize the page once the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayPosts(); // Display posts when the DOM is ready
  var myModal = new bootstrap.Modal(document.getElementById("createPostModal"));
  myModal.show();
});

// Create Post
createPostForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const postTitle = event.target.postTitle.value;
  const postContent = event.target.postContent.value;

  try {
    await addDoc(collection(db, "posts"), {
      title: postTitle,
      content: postContent,
      userId: auth.currentUser.uid,
      timestamp: new Date(),
    });
    displayPosts(); // Refresh posts after creating a new post
  } catch (error) {
    console.error("Error creating post: ", error);
  }
});

// Delete Post
const deletePost = async (id) => {
  try {
    const postRef = doc(db, "posts", id);
    await deleteDoc(postRef);
    displayPosts(); // Refresh posts after deleting
  } catch (error) {
    console.error("Error deleting post: ", error);
  }
};

// Edit Post (Optional for now, implement logic if required)
const editPost = async (id, title, content) => {
  console.log(`Editing post: ${id}, Title: ${title}, Content: ${content}`);
};
