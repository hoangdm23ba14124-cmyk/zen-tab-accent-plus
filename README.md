# Zen Tab Accent Plus

Vạch active bên trái, rõ nét; vạch trắng cho pinned/essential đã unload; double-click để unload và giữ pin.

- Active: xanh đậm `#0047ff`, dày 5px, viền sáng/tối để nhìn rõ trên nhiều nền.
- Pin/Essential đang unload (`pending`): trắng. Tab chỉ không được chọn nhưng vẫn đang chạy không có vạch trắng.
- Có tùy chọn đổi màu, độ dày, trái/phải và ẩn vạch trắng trong Settings → Zen Mods.
- Companion bắt double-click chuột trái vào pin/essential, gọi `gZenPinnedTabManager.onCloseTabShortcut` với `unload-switch`. Không xóa pin, không reset URL. Tab thường giữ nguyên hành vi của Zen.
- Tắt mod hoặc bỏ chọn “Double-click…” sẽ vô hiệu hóa thao tác này. Script cần được cài riêng vì Zen Mods chỉ chạy CSS.

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
