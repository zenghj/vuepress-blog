---
title: git非常规操作
date: 2019-12-06
tags: 
  - Git
author: Julianzeng
location: Beijing  
---

## git stash

## git仓库迁移需要注意的事

## git rebase
* https://www.freecodecamp.org/news/an-introduction-to-git-merge-and-rebase-what-they-are-and-how-to-use-them-131b863785f/

## git submoudule

### 使用场景

复用某部分子模块功能，等同于npm包功能，但是是通过git进行的模块管理

### 使用

#### 添加一个子模块

在仓库的根目录执行下面的命令
```bash
git submodule add <url> path
```
比如`git submodule add git@github.com:zenghj/test.git notes/git/demo/test-submodule`

添加完就会clone test仓库到本地，直接修改submodule仓库的文件是不会被上层git仓库跟踪到的，但是子git仓库还是可以跟踪和提交

#### 克隆一个带子模块的项目

克隆上层仓库，子模块仅仅被拉取了一个文件夹，里面没有任何内容。

接下来要执行两个命令：

1. 初始化本地配置文件
```bash
git submodule init
```

2.拉取子目录所有数据，并检出上层仓库里所列的提交。

```bash
git submodule update
```

之后每次需要更新子模块仓库时都需运行 `git submodules update`。子模块并不会随上层目录的更新而一起更新。

#### 需要注意的问题

1. 上层仓库只保持对子模块的一个记录，而不会跟踪内部文件。
上层仓库（后简称 A 仓库）只会保留子模块（后简称 B 仓库）的一个提交记录（即 HEAD 指针值）。所以当在 A 仓库拉取更新时，B 仓库的内容并不会得到更新，而是只是更新了 B 仓库的 HEAD。当执行 git submodule update 命令时，B 仓库才会从远程仓库拉取所有数据，并根据 A 仓库中对 B 仓库的 HEAD 记录检出需要的文件内容。

2. 模块拉取失败的原因
有上文可知，A 仓库仅仅记录一个 HEAD 值。所以当一个开发者在本地的 B 仓库里做了代码的修改，并提交，但未推送到远程仓库。他随后在 A 仓库中进行了提交和推送，此时 A 仓库会记录 B 仓库在该开发者本地的一个 HEAD。当其他开发者尝试通过 git submodule update 更新 B 仓库时，会发生错误，因为此时 B 仓库的 HEAD 所指向的提交只存在于第一个开发者的本地。

此时，你只能查看是谁提交了本次更改，然后联系他，教育他一下。

3. 子模块里工作要格外小心

因为在上层仓库里进行 git submodule update 时会将子模块检出至一个游离的 HEAD，这可能导致你在子目录里提交但未在上层仓库提交的工作丢失。这种情况仍可以使用 git reflog 命令去查找出那个游离的 HEAD。但仍要避免这种失误出现。

（考虑不要直接在子模块修改内容吧）

## 参考资源

* [git submodule使用场景](https://zhuanlan.zhihu.com/p/61710235)
* [Git 子模块 submodule 的使用](https://www.hozen.site/archives/23/)