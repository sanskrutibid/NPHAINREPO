import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SeoService } from '../../core/seo.service';
import { BLOG_POSTS, BlogPost } from '../../core/blog.data';

/** One template for every blog post. Posts live in src/app/core/blog.data.ts and open at /blog/<slug>. */
@Component({
  selector: 'app-blog-post',
  standalone: true,
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss',
})
export class BlogPostComponent implements OnDestroy {
  post: BlogPost | undefined;
  others: BlogPost[] = [];
  private sub: Subscription;

  constructor(route: ActivatedRoute, private seo: SeoService) {
    this.sub = route.paramMap.subscribe(p => {
      const slug = p.get('slug');
      this.post = BLOG_POSTS.find(b => b.slug === slug);
      this.others = BLOG_POSTS.filter(b => b.slug !== slug).slice(0, 3);
      if (this.post) {
        const b = this.post;
        this.seo.set({
          path: '/blog/' + b.slug,
          title: b.title + ' | Phian Blog',
          description: b.summary,
          noindex: false,
          ld: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: b.title,
            description: b.summary,
            datePublished: b.isoDate,
            author: { '@type': 'Organization', name: 'Phian' },
            publisher: { '@type': 'Organization', name: 'Phian' },
          },
        });
      } else {
        this.seo.set({ path: '/blog/' + slug, title: 'Post not found | Phian', description: 'This blog post could not be found.', noindex: true, ld: null });
      }
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}