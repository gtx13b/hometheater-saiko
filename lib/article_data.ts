import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  image?: string;
}

const ARTICLES_DIRECTORY = path.join(process.cwd(), 'data', 'blog-articles');
const DEFAULT_IMAGE = '/images/blog/dolby-atmos-flexconnect-tcl.webp';

export function getArticlesData(): Article[] {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) {
    console.warn(`Warning: Directory not found at ${ARTICLES_DIRECTORY}. Returning empty array.`);
    return [];
  }

  const filenames: string[] = fs.readdirSync(ARTICLES_DIRECTORY);

  const articles: Article[] = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const fullPath = path.join(ARTICLES_DIRECTORY, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { data, content } = matter(fileContents);
      const id = filename.replace(/\.md$/, '');

      let cleanContent = content
        .replace(/<[^>]+>/g, '')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*>+\s?/gm, '')
        .trim();

      const excerpt = cleanContent.substring(0, 200);
      const finalContent = excerpt + (cleanContent.length > 200 ? '...' : '');

      let imageUrl = data.image;
      if (!imageUrl || imageUrl.toLowerCase() === 'none') {
        imageUrl = DEFAULT_IMAGE;
      }

      return {
        id,
        title: data.title || id,
        category: data.category || '記事',
        date: data.date || '2024-10-01',
        content: finalContent,
        image: imageUrl,
      };
    });

  return articles;
}
