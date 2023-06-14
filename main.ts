import { JSerStat } from 'npm:@jser/stat';
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

/**
 * 平均を求める
 * @param data
 * @returns {number}
 */
function average(data: number[]) {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
    }
    return (sum / data.length);
}

/**
 * 中央値を求める
 * @param arr
 * @returns {*}
 */
function median(arr: number[]) {
    var half = (arr.length / 2) | 0;
    var temp = arr.sort();

    if (temp.length % 2) {
        return temp[half];
    }

    return (temp[half - 1] + temp[half]) / 2;
}

function calcData(stat: JSerStat) {
    var jSerWeeks = stat.getJSerWeeks();
    var latestWeek = jSerWeeks[jSerWeeks.length - 1];
    var now = new Date();
    var endDate = latestWeek.endDate;
    var unpublishedItems = stat.findItemsBetween(endDate, now);
    var itemCountList = jSerWeeks.map(function (week) {
        return week.items.length;
    });
    return {
        average: average(itemCountList),
        median: median(itemCountList),
        current: unpublishedItems.length
    };
}

function fetchURL(url: string) {
    return fetch(url).then(function (response) {
        return response.json();
    })
}

async function getStat() {
    const [posts, items] = await Promise.all([
        fetchURL("https://jser.info/posts.json"),
        fetchURL("https://jser.info/source-data/items.json")
    ]);
    const jSerStat = new JSerStat(items, posts);
    return jSerStat;
}

async function main() {
    const stat = await getStat();
    const data = calcData(stat);
    console.log(data);
}

async function handler(req: Request): Promise<Response> {
    const stat = await getStat();
    const data = calcData(stat);
    return new Response(JSON.stringify(data, null, 4), {
        status: 200,
        headers: {
            "content-type": "application/json",
        },
    });
}

serve(handler);
