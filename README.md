# 截取内容

- 达人: ('web/user/profile/other/')

  1. sec_id user.sec_uid 查看地址后面的一串？ 如："MS4wLjABAAAAEBwQd-UcO2TUV6F6YcMLoxWc0QVSxGAH5-pY1JT0kuQ"
  2. icon_url user.avatar_thumb.url_list[0] 这是大人头像地址？
  3. '关注' user.following_count
  4. '粉丝' user.follower_count
  5. '获赞' user.total_favorited
  6. '抖音号' user.short_id
  7. 'IP 属地' user.ip_location

- 视频：('/web/aweme/post/')
  1. 是否置顶 aweme_list[0].is_top
  2. 点赞数 aweme_list[0].statistics.digg_count
  3. vid aweme_list[0].aweme_id
  4. title aweme_list[0].item_title
