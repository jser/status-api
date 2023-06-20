# JSer.info Status API

JSer.infoの投稿ステータスを返すAPI

```shell
$ curl https://jser-status.deno.dev/
{
    "average": 18.581143740340032,
    "median": 18,
    "current": 13
}
```

- average: 今までの記事に含まれる平均アイテム数
- median: 今までの記事に含まれるアイテム数の中央値
- current: 現在のアイテム数

ロジックはウェブサイト版と同じ

- https://jser.info/status-of-post/

## LICENSE

MIT
