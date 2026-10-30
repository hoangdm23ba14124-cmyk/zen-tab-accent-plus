# Zen Tab Accent Plus

Bản 1.12.1 mặc định tự giãn hàng chưa đủ ô: 5 pin với 3 cột thành 3+2, hai pin cuối mỗi pin chiếm nửa hàng. Áp dụng cho vùng pin chính, folder, mẫu từng hàng và hàng bị ngắt bởi pin dạng hàng/thư mục. Tắt “Tự giãn pin lấp đầy hàng chưa đủ ô” để giữ độ rộng cố định. Chế độ số cột “Tự động theo SuperPins” không có mẫu riêng vẫn do SuperPins quyết định. Cần khởi động lại Zen để nạp companion.

Bản 1.12.0 tách cài đặt “Vùng pin chính” và “Trong folder”, mỗi nhóm có số cột chung và mẫu từng hàng độc lập. Mẫu pin cũ chỉ áp dụng ngoài folder; folder mặc định 3 cột. Mẫu folder bắt đầu lại từ đầu trong mỗi folder, kể cả folder con. Không thay đổi trạng thái thu gọn folder. Khởi động lại để nạp companion mới.

Bản 1.11.1: double-click tiêu đề pin dạng hàng mở trình đổi tên gốc của Zen; Enter lưu, Escape hủy. Double-click biểu tượng vẫn unload. Có thể dùng mục đổi tên trong menu chuột phải của Zen. Cần bật tùy chọn đổi tên tab của Zen và không bật đóng tab bằng double-click để dùng thao tác double-click đổi tên.

Bản 1.11.0: nhập “Số pin từng hàng” như `3,2,4` để đặt số ô riêng cho mỗi hàng (1–6 ô/hàng, tối đa 50 hàng khai báo). Những hàng tiếp theo lặp số cuối; để trống hoặc nhập sai định dạng thì dùng số cột chung. Mẫu áp dụng từ đầu cho từng workspace/thư mục. Pin dạng hàng và thư mục ngắt hàng ô; không đổi thứ tự tab. Cần khởi động lại Zen để nạp companion mới; sau đó thay mẫu có hiệu lực trực tiếp. Chỉ cập nhật theo thay đổi tab/cài đặt, không dùng polling.

Bản 1.10.0 thêm “Số pin mỗi hàng (SuperPins)”: mặc định 3, chọn 1–6 hoặc tự động theo SuperPins. Với 5 pin và 3 cột, hàng đầu có 3 ô, hàng cuối có 2 ô giữ cùng kích thước. Pin được chọn hiển thị dạng hàng vẫn chiếm toàn hàng tại đúng vị trí của nó. Chỉ áp dụng khi sidebar mở rộng và SuperPins legacy layout bật; lựa chọn cố định ưu tiên hơn auto-grow của SuperPins. Chọn tự động để trả lại bố cục SuperPins.

Bản 1.9.0: chuột phải từng pin → “Hiển thị pin dạng hàng” để hiện cả tiêu đề và chiếm một hàng; bỏ chọn để trở lại ô SuperPins. Cần companion và SuperPins legacy layout. Lựa chọn lưu qua SessionStore theo tab, hoạt động trong grid và auto-grow; sidebar thu gọn vẫn dùng giao diện gọn. Không thay đổi thứ tự tab hoặc áp dụng cho Essential/Glance. Khởi động lại Zen sau khi cập nhật companion.

Bản 1.8.0 làm rõ nhóm pin được chọn bằng viền 2px và nền màu nhấn, hỗ trợ SuperPins và pin dạng danh sách. Dùng Cmd+click trên macOS (Ctrl+click trên Windows/Linux) để thêm/bỏ từng tab, Shift+click để chọn một dải theo thứ tự tab, click thường để bỏ chọn nhóm. Dùng thao tác chọn nhiều sẵn có của Zen, không thêm listener hay bộ đếm JavaScript. Có thể tắt phần trang trí qua “Hide enhanced multi-selection highlight on pinned tabs”. Không áp dụng trang trí này cho Essential hoặc Glance.

Bản 1.7.4 mặc định ẩn vạch màu container trên tab. Bật “Show container color stripe on tabs” để hiện lại. Chỉ ẩn `.tab-context-line`; không đổi container, màu nhận diện ở nơi khác hay thanh nhấn của mod.

Các tab pin còn được nạp đồng thời hiện thanh màu nhấn dọc bên trái, không viền; pin đã unload mặc định không hiện thanh. Double-click để unload và giữ pin. Trạng thái pin và double-click không áp dụng cho Essential.

Bản 1.7.3 khôi phục thanh nhấn dọc bo tròn. Màu và độ dày dùng các tùy chọn “Indicator color” và “Indicator width”; có thể chuyển thanh sang phải. Các công tắc ẩn pin loaded/unloaded vẫn hoạt động. Tùy chọn màu chấm riêng của bản 1.7.0 không còn được sử dụng.

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
- “Small Glance badge above pinned favicon (SuperPins grid)”: Glance nằm ở góc trên bên phải favicon, kích thước 14px, trong đúng ô pin. Khi có cả Glance và âm thanh, âm thanh chuyển sang góc trên bên trái để không chồng nhau. Chỉ điều chỉnh vị trí trong bố cục grid của SuperPins. Vạch nhấn/nền Essential chỉ tác động lên tab chủ, không lan xuống tab Glance lồng bên trong.
- “Center pinned favicons in their cells (SuperPins grid)”: căn chính giữa favicon của từng pin bằng flex alignment, bỏ margin lệch của SuperPins/Zen. Vạch màu container có thể bật lại bằng “Show container color stripe on tabs”.

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

Mã nguồn: [hoangdm23ba14124-cmyk/zen-tab-accent-plus](https://github.com/hoangdm23ba14124-cmyk/zen-tab-accent-plus). Chưa có trên Zen Store. Việc xuất bản lên GitHub không tự đăng ký mod vào kho; dùng bộ cài local ở trên để đưa mod vào danh sách bật/tắt. Companion cần cài riêng vì Zen Mods chỉ chạy CSS.

```sh
git clone https://github.com/hoangdm23ba14124-cmyk/zen-tab-accent-plus.git
cd zen-tab-accent-plus
```

## Kiểm tra

Xem [PERFORMANCE.md](PERFORMANCE.md) và [performance-results.json](performance-results.json) cho phép đo RAM và chi phí đổi tab của bản 1.6.0; kết quả đó không đại diện cho toàn bộ chức năng mới của 1.12.1. Companion hiện có thêm menu, listener khôi phục tab, observer cài đặt và MutationObserver cho bố cục. Các cập nhật được gom bằng requestAnimationFrame, không dùng polling. Listener và observer được dọn khi đóng cửa sổ hoặc nạp lại script.

```sh
python3 -m unittest discover -s tests -v
```

Xem `TESTING.md` cho kết quả kiểm tra thực tế và giới hạn.
