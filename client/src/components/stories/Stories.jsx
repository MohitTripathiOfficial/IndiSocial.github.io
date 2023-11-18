import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories/").then((res) => {
      return res.data;
    })
  );
  // console.log(data)
  //TODO Add story using react-query mutations and use upload function.
  const [openUpdate, setOpenUpdate] = useState(false);
  const [story, setStory] = useState(null);

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    // console.log(file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/stories/", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["newStory"]);
      },
    }
  );
  const handleClick = async (e) => {
    e.preventDefault();
    // setOpenUpdate(true)
    let storyUrl;
    // storyUrl = story ? await upload(story) : data.img;
    // // console.log(profileUrl)
    if (file) storyUrl = await upload();
    mutation.mutate({ img: storyUrl });
    // setOpenUpdate(false);
    // setStory(null);
    setDesc("");
    setFile(null);
  }

  return (
    <div className="stories">
      <label htmlFor="file">
        <div className="story">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
          <button onClick={handleClick}>+</button>
        </div>
      </label>
      {error
        ? "Something went wrong"
        : isLoading
          ? "loading"
          : data.map((story) => (

            <div className="story" key={story.id}>
              <img src={"/upload/" + story.img} alt="" />
              <span>{story.name}</span>
            </div>

          ))}
      <div className="right">
        {file && (
          <img className="file" alt="" src={URL.createObjectURL(file)} />
        )}
      </div>
      {openUpdate && setOpenUpdate}
    </div>
  );

};

export default Stories;
