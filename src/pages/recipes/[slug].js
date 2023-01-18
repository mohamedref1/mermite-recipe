import Skeleton from "@/components/Skeleton";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient } from "contentful";
import Image from "next/image";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async() => {
  const res = await client.getEntries({ content_type: 'recipe' });

  const paths = res.items.map((item) => ({
    params: { slug: item.fields.slug }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ slug }) {
  const { items } = await client.getEntries({ 
    content_type: 'recipe',
    fields: { slug }
  });

  return {
    props: {
      recipe: items[0]
    },
    revalidate: 1
  }
}

export default function RecipeDetails({ recipe }) {
  if (!recipe) return <Skeleton />

  const { title, slug, cookingTime, thumbnail, ingredients, method } = recipe.fields;

  console.log(ingredients)

  return (
    <div>
      <div className="banner">
        <Image 
          src={`https:${thumbnail.fields.file.url}`}
          width={thumbnail.fields.file.details.image.width}
          height={thumbnail.fields.file.details.image.height}
          alt=""
        />
        <h2>{title}</h2>
      </div>
      <div className="info">
        <p>Take about { cookingTime } mins to cook.</p>
        <h3>Ingredients</h3>
        {ingredients.map((ingredient) => (
          <span key={ingredient}>{ingredient}</span>
        ))}
      </div>
      <div className="method">
        <h3>Method</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  )
}