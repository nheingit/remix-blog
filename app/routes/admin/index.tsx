import { Link } from "remix";

export default function Admin() {
  return(
    <p>
      <Link to="new">Create Post</Link>
    </p>
  )
}