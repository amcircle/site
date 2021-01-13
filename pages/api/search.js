// import Fuse from 'fuse.js';
// import siteRoutes from '../../components/util/allRoutes';
//
// function includesOneOf(sbj, list) {
//   return !!list.find(el => sbj.includes(el))
// }
//
// function oneOf(sbj, list) {
//   return !!list.find(el => sbj == el);
// }
//
// function cleanRoute(route) {
//   return '/' + route.split('./')[1].split('/index.')[0].split('.')[0];
// }
//
// export default (req, res) => {
//   const { type, s, lang } = req.query;
//   if (!type ||
//       !s ||
//       !lang ||
//       !oneOf(type,['blog','lectures','projects','guides','publications']) ||
//       !oneOf(lang,['ru','en'])
//     ) {
//     res.status(404).json({'error':'404'});
//     return;
//   }
//   const { allRoutes, allRoutesContext } = siteRoutes();
//   const allContentPages = allRoutes
//     .filter(route => includesOneOf(route, [type]))
//     .filter(route => route.includes('/'+lang))
//     .slice(0,50)
//     .map(route => {
//       let meta = allRoutesContext(route).meta;
//       meta = meta ? {
//         title: meta.title,
//         description: meta.description,
//         keywords: meta.keywords,
//         authors: meta.authors,
//         date: meta.date
//       } : null;
//       return {meta, route: cleanRoute(route)}
//     })
//     .filter(page => page.meta);
//
//   const options = {
//     shouldSort: true,
//     threshold: 0.4,
//     includeMatches: true,
//     location: 0,
//     distance: 1000,
//     maxPatternLength: 32,
//     minMatchCharLength: 3,
//     keys: ['meta.title', 'meta.description','meta.keywords']
//   };
//   const fuse = new Fuse(allContentPages, options);
//   res.status(200).json(fuse.search(s));
// };
