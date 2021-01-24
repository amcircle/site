import ContentCard from './ContentCard';

const ContentGrid = ({
  content,
  highlightFirst,
  imageOnTop,
  Special,
  HeaderLink,
  Link,
  Footer,
  limit,
  grid,
  onlyFeatured
}) => {
  //return props => {
    grid = grid ? grid : {xs: 1, sm: 2, lg: 3};
    if (onlyFeatured) content = content.filter(post => post.featured);
    if (limit) content = content.slice(0,limit);
    const items = content.map((meta, index) => {
      return (
        <ContentCard
          key={index}
          index={index}
          highlightFirst={highlightFirst}
          image={meta.cover}
          imageOnTop={imageOnTop}
          HeaderLink={HeaderLink ? (props) => <HeaderLink route={meta.route} meta={meta}>{props.children}</HeaderLink> : false}
          title={meta.title}
          description={meta.description}
          Special={Special ? <Special route={meta.route} meta={meta} /> : false}
          Link={ Link ? <Link route={meta.route} meta={meta} /> : false}
          Footer={Footer ? <Footer route={meta.route} meta={meta} /> : false }
         />
      );

    });

    return (
      <div className={`row row-cols-${grid.xs} row-cols-sm-${grid.sm} row-cols-lg-${grid.lg}`}>
        {items}
      </div>
    );
  //};
};

export default ContentGrid;
