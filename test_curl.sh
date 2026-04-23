#!/bin/bash
curl 'https://melolo.com/id' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: id-ID' \
  -H 'cache-control: max-age=0' \
  -H 'cookie: sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22aFRowiLAR47l2ycb%23dc035f29d8f9ba1f2eda957b7c247e33%22%2C%22first_id%22%3A%22aFRowiLAR47l2ycb%23dc035f29d8f9ba1f2eda957b7c247e33%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTlkYjljZWQwOWMyNjYtMDc4ZWVjYWY5NTNlZGMtYjQ1NzU1Ny0yOTUyMDAtMTlkYjljZWQwOWQyOTAiLCIkaWRlbnRpdHlfbG9naW5faWQiOiJhRlJvd2lMQVI0N2wyeWNiI2RjMDM1ZjI5ZDhmOWJhMWYyZWRhOTU3YjdjMjQ3ZTMzIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22aFRowiLAR47l2ycb%23dc035f29d8f9ba1f2eda957b7c247e33%22%7D%7D; _ym_uid=1776938832793862903; _ym_d=1776938832; _ga=GA1.1.1617954140.1776938833; _ym_isad=2; _ym_visorc=w; _ga_CCRWPSCRVG=GS2.1.s1776938832$o1$g1$t1776941327$j45$l0$h0' \
  -H 'priority: u=0, i' \
  -H 'sec-ch-ua: "Chromium";v="127", "Not)A;Brand";v="99", "Microsoft Edge Simulate";v="127", "Lemur";v="127"' \
  -H 'sec-ch-ua-mobile: ?1' \
  -H 'sec-ch-ua-platform: "Android"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36' > test_fetch_index.html
