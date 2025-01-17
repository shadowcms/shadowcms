const PlaceholderConfig = {
  showOnlyCurrent: false,
  placeholder: ({ node }: any) => {
    const headingPlaceholders = {
      1: 'Enter a heading...',
      2: 'Enter a subheading...',
    };

    if (node.type.name === 'heading') {
      return (headingPlaceholders as any)[node.attrs.level];
    }

    if (node.type.name === 'codeBlock') {
      return 'Enter HTML Code...';
    }

    if (node.type.childCount < 100) {
      return 'Begin writing...';
    }

    return 'Write content...';
  },
};

export default PlaceholderConfig;
