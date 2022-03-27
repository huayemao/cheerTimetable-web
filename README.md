
## Overview

见 [绮课简介](https://www.yuque.com/huayemao/cheer-timetable/overview)

## 技术栈

- [React.js](https://beta.reactjs.org/)
- [Next.js](https://nextjs.org/)
- [TailwindCss](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)

## get Started

:::info
此文档可能并不足够详尽，如遇到问题，请联系作者
:::

### 0. 安装 Node.JS 运行环境

请安装 [Node.js 12.22.0](https://nodejs.org/) 或更新版本

### 1. 克隆代码仓库

`git clone [https://github.com/huayemao/cheerTimetable-web.git](https://github.com/huayemao/cheerTimetable-web.git)`或 `git clone git@github.com:huayemao/cheerTimetable-web.git`

### 2. 配置数据库

准备一个 mysql 数据库实例，或者使用 [PlanetScale ](https://planetscale.com/)提供的服务，这也是目前绮课在生产环境所使用的。
在项目根目录创建环境变量文件 .env，并添加数据库连接字符串的环境变量，如

```latex
DATABASE_URL='mysql://root:huayemao123@localhost:3306/cheerTimetable'
```

### 3. 安装依赖
使用 `npm install`或 `yarn`命令安装 npm 依赖

### 4. 导入数据

运行 `yarn db:seed` 将自动从教务系统导入数据

:::warning

- 如果因为网络问题而导致进程退出，可直接重新执行。
- 如果遇到外键约束相关的错误，请尝试注释掉 `prisma/schema.prisma`文件中的 `referentialIntegrity="prisma"` 一行，并运行 `yarn db:generate`，再重新运行 `yarn db:seed`
:::

### 5. 开发调试

运行 `yarn dev`将以开发模式启动 Next.js 项目，更多请见 [Next.js 文档](https://nextjs.org/docs/getting-started) 

## 主要目录结构

```latex

├── _data // 以异步 IIFE 导出从教务系统获取数据所需的 JSON
├── components // React 组件
├── constants // 常量
├── contexts // 存放 React Contexts
├── lib // 抽出的工具函数
├── pages // Next.js 路由页面
├── prisma // 数据库相关，包括模式定义和数据库导入脚本
```
