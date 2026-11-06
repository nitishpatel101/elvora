import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProducts } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Creations | ELVORA',
    };
  }

  return {
    title: `${product.name} | ELVORA Fine Jewellery`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ELVORA`,
      description: product.description,
      images: [
        {
          url: product.images[0] || '/images/products/touch-distance-bracelet/hero.jpg',
          width: 1024,
          height: 1024,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts(false);
  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) =>
      img.startsWith('http') ? img : `https://elvora.com${img}`
    ),
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'ELVORA',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `https://elvora.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ELVORA',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="min-h-screen bg-[#FAF8F5] py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        </div>
      </div>
    </>
  );
}
