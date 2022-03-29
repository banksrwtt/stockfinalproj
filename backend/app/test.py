import notifunc as ntf

stock_noti_name = 'BEM'

header_list = ['malength', 'emalength', 'rsilength']
header_dict = {
    'malength': ntf.ma,
}
linetoken = 'tdqgISkyFgDJHF3FSdnW13LbNBwOKiNkTidAlOSSoQ5'
# for i in header_dict.keys():
header_dict['malength'](stock_noti_name, 9, linetoken)
