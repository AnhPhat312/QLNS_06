// Báo cho TypeScript biết rằng hãy chấp nhận tất cả các file đuôi .jsx
declare module "*.jsx" {
  const content: any;
  export default content;
}
