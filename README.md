# Zen Tab Accent Plus

Các tab pin còn được nạp đồng thời hiện màu nhấn bên trái, không viền; pin đã unload mặc định không hiện vạch. Double-click để unload và giữ pin. Trạng thái pin và double-click không áp dụng cho Essential.

- Active: xanh đậm `#0047ff`, dày 5px, không viền hoặc bóng đổ quanh vạch.
- Pin còn được nạp (`pinned`, không `pending`, không Essential): luôn hiện màu nhấn, kể cả khi tab khác đang được chọn. “Được nạp” bao gồm cả trang đang tải và trang đã tải xong.
- Pin đã unload (`pending`): mặc định không hiện vạch; có thể bật lại vạch trắng qua tùy chọn.
- Có công tắc riêng để ẩn màu nhấn của pin đang nạp, ẩn vạch của pin unload, ẩn vạch active trên tab thường/Essential, và ẩn phần trăm zoom. Mức zoom trang không thay đổi.
- Có tùy chọn đổi màu, độ dày, trái/phải và ẩn vạch trắng trong Settings → Zen Mods.
- Companion bắt double-click chuột trái vào pin, gọi `gZenPinnedTabManager.onCloseTabShortcut` với `unload-switch`. Không xóa pin, không reset URL. Essential và tab thường giữ nguyên hành vi của Zen.
- Tắt mod hoặc bỏ chọn “Double-click…” sẽ vô hiệu hóa thao tác này. Script cần được cài riêng vì Zen Mods chỉ chạy CSS.
- Tự vào toàn màn hình khi mở cửa sổ Zen thông thường. Bật/tắt bằng “Automatically enter fullscreen when opening Zen” (cần companion). Chỉ chạy một lần khi cửa sổ khởi động, nên bạn vẫn có thể thoát fullscreen và tiếp tục sử dụng cửa sổ bình thường. Thay đổi tùy chọn áp dụng cho cửa sổ mở sau đó; không ép cửa sổ hiện tại vào/thoát fullscreen. Không áp dụng cho cửa sổ popup không có toolbar.
- “Small audio badge on pinned tab favicon”: biểu tượng âm thanh nhỏ 14px ở góc favicon của chính pin, thay cho nút âm thanh riêng có thể tràn sang ô kế bên trong SuperPins. Vẫn bấm mute/unmute được. Essential và tab thường giữ biểu tượng âm thanh native.
- “Keep loaded Essentials highlighted until unloaded”: Essential còn được nạp giữ nền sáng kiểu selected kể cả khi bạn chuyển sang pin hoặc tab thường. Khi unload, trả về nền bình thường của theme. Hỗ trợ nền sáng/tối theo theme; không áp dụng double-click unload cho Essential.
- “Small Glance badge inside pinned tab (SuperPins grid)”: Glance nằm ở góc dưới bên phải favicon, kích thước 14px, trong đúng ô pin; âm thanh ở góc trên để không chồng nhau. Chỉ điều chỉnh vị trí trong bố cục grid của SuperPins. Vạch nhấn/nền Essential chỉ tác động lên tab chủ, không lan xuống tab Glance lồng bên trong.

### Giới hạn profile

Mod này không biến container thành profile độc lập. Container trong cùng một profile Zen vẫn chia sẻ extension, lịch sử và kho mật khẩu. Cô lập đầy đủ đồng thời chuyển profile trong cùng cửa sổ như yêu cầu cần thay đổi kiến trúc/lõi trình duyệt, không được triển khai trong mod này. Xem [Zen Workspaces](https://docs.zen-browser.app/user-manual/workspaces) và [Mozilla profiles](https://support.mozilla.org/en-US/kb/profile-management).

Trong Settings → Zen Mods, mặc định “Hide accent on loaded pinned tabs” bỏ chọn và “Hide all indicators on unloaded pinned tabs” được chọn. Bỏ chọn mục thứ hai để hiện lại vạch trắng. Các tùy chọn pin độc lập với “Hide active indicator on regular tabs and Essentials”. Khi nâng cấp từ bản cũ, Zen giữ giá trị tùy chọn đã lưu; hãy chọn lại “Hide all indicators…” nếu cần.

## Cài local vào Zen Mods

1. Mở `about:support`, lấy đường dẫn **Profile Folder**.
2. Thoát hẳn Zen bằng Cmd+Q (không chỉ đóng cửa sổ).
3. Trong thư mục repo, chạy (thay đường dẫn profile):

```sh
python3 install.py --profile "/đường/dẫn/profile"
```

Cài cả double-click trên macOS:

```sh
python3 install.py --profile "/đường/dẫn/profile" --app-resources "/Applications/Zen.app/Contents/Resources"
```

4. Mở Zen → Settings → Zen Mods → **Zen Tab Accent Plus**, tắt rồi bật lại **một lần sau khi cài/cập nhật** để Zen tạo lại stylesheet và khởi tạo preferences. Sau đó bật/tắt và đổi tùy chọn tại đây.

Bộ cài sao lưu registry và phiên bản cũ vào `PROFILE/zen-tab-accent-backups/`, giữ các mod khác và tắt Better Active Tab gốc để tránh hai vạch chồng nhau. Bộ cài không sửa `userChrome.css`; nếu bạn từng thêm indicator thủ công trong đó, cần bỏ phần đó để tránh xung đột. Better Unloaded Tabs hoặc theme khác có thể giảm opacity toàn bộ tab, làm cả vạch trắng mờ theo; tắt hiệu ứng đó nếu cần.

### Companion và giới hạn

AutoConfig chạy JavaScript có quyền browser chrome. Bộ cài chỉ nạp file local cố định `PROFILE/chrome/zen-tab-accent.uc.js`, không tải script từ mạng. Nó cần ba preference AutoConfig trong `Resources/defaults/pref/zen-tab-accent.js`, gồm tắt sandbox AutoConfig để truy cập UI. Chỉ dùng mã bạn tin tưởng.

Nếu đã có AutoConfig/userChromeJS loader, bộ cài từ chối ghi đè cấu hình hiện có. Dùng loader đó để nạp `companion/zen-tab-accent.uc.js` trong browser window sau delayed startup. Bản cập nhật Zen có thể xóa loader trong thư mục ứng dụng; cài lại nếu double-click ngừng hoạt động. Không cần companion nếu chỉ dùng vạch màu.

Double-click thay thế thao tác đổi tên tab pin tại vị trí đó; vẫn có thể đổi tên qua menu chuột phải. Zen có thể từ chối unload khi trang cần xác nhận dữ liệu chưa lưu. Split View và Glance theo hành vi unload native của Zen; chưa được kiểm tra đầy đủ.

### Gỡ bỏ

Tắt hoặc xóa mod trong Zen Mods. Khi Zen đã thoát, xóa `PROFILE/chrome/zen-tab-accent.uc.js`. Nếu đã cài AutoConfig của repo này, xóa đúng hai file `Resources/zen-tab-accent.cfg` và `Resources/defaults/pref/zen-tab-accent.js`. Không xóa AutoConfig của công cụ khác. Khởi động lại Zen. Muốn khôi phục registry trước cài, khi Zen đã thoát hãy chép `zen-themes.json` từ bản sao lưu về profile (thao tác này khôi phục toàn bộ danh sách mod tại thời điểm sao lưu).

## GitHub và Zen Store

Đây là bộ mã độc lập, viết mới, lấy ý tưởng từ [Better Active Tab Indicator](https://github.com/HliasOuzounis/zen-browser-better-active-tab-indicator); không sao chép mã hoặc hình ảnh từ repo không có license đó.

Chưa được xuất bản lên GitHub/Zen Store. Nút Import của Zen sử dụng ID trong kho chính thức, không phải bộ cài cho repo GitHub bất kỳ. Cài local ở trên đưa mod vào cùng danh sách bật/tắt. Để xuất bản, tạo repo `zen-tab-accent-plus`, push mã này, rồi bổ sung URL homepage/style/readme/preferences vào metadata khi gửi lên [theme-store](https://github.com/zen-browser/theme-store). Companion không được chạy bởi kho CSS; phải phân phối riêng. Không hứa hẹn thời gian duyệt hoặc khả năng nhận submission của kho.

```sh
git remote add origin https://github.com/YOUR_USERNAME/zen-tab-accent-plus.git
git push -u origin main
```

## Kiểm tra

```sh
python3 -m unittest discover -s tests -v
```

Xem `TESTING.md` cho kết quả kiểm tra thực tế và giới hạn.
