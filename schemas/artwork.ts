export default {
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.min(1),
    },
    {
      name: 'medium',
      title: 'Medium',
      type: 'string',
      description: 'e.g. Acrylic on canvas, Oil and charcoal, Digital photograph',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'e.g. 48 x 60 in (122 x 152 cm)',
    },
    {
      name: 'year',
      title: 'Year Created',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Pricing',
      type: 'object',
      fields: [
        {
          name: 'kes',
          title: 'Price (KES)',
          type: 'number',
        },
        {
          name: 'usd',
          title: 'Price (USD)',
          type: 'number',
        },
      ],
    },
    {
      name: 'printPrice',
      title: 'Print Pricing (If prints are enabled)',
      type: 'object',
      fields: [
        {
          name: 'kes',
          title: 'Print Price (KES)',
          type: 'number',
        },
        {
          name: 'usd',
          title: 'Print Price (USD)',
          type: 'number',
        },
      ],
    },
    {
      name: 'type',
      title: 'Artwork Type',
      type: 'string',
      options: {
        list: [
          { title: 'Original Painting', value: 'original' },
          { title: 'Print Available', value: 'print' },
          { title: 'Original & Prints Available', value: 'both' },
        ],
        layout: 'radio',
      },
      initialValue: 'original',
    },
    {
      name: 'status',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'Available for Purchase', value: 'available' },
          { title: 'Sold / Collected', value: 'sold' },
          { title: 'Inquire Only / On Reserve', value: 'inquire' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
    },
    {
      name: 'description',
      title: 'Description / Curator Statement',
      type: 'text',
      rows: 4,
    },
    {
      name: 'category',
      title: 'Categories / Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'featured',
      title: 'Featured Work',
      type: 'boolean',
      description: 'Display on homepage hero and featured reel',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'medium',
      media: 'images.0',
    },
  },
};
