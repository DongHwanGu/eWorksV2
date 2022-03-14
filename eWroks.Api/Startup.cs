using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eWroks.Api.Models.CbSchedule;
using eWroks.Api.Models.CbTimeSheet;
using eWroks.Api.Models.CmApproval;
using eWroks.Api.Models.CmCode;
using eWroks.Api.Models.CmDept;
using eWroks.Api.Models.CmHoliDay;
using eWroks.Api.Models.CmLogin;
using eWroks.Api.Models.CmMain;
using eWroks.Api.Models.CmMeetingRoom;
using eWroks.Api.Models.CmNotice;
using eWroks.Api.Models.CmProgram;
using eWroks.Api.Models.CmRoleProgram;
using eWroks.Api.Models.CmUser;
using eWroks.Api.Models.CmVendor;
using eWroks.Api.Models.Common;
using eWroks.Api.Models.FiPurchase;
using eWroks.Api.Models.FiPurchaseSetting;
using eWroks.Api.Models.FiTravel;
using eWroks.Api.Models.HrCertificate;
using eWroks.Api.Models.HrExternalTraining;
using eWroks.Api.Models.HrHealthCheck;
using eWroks.Api.Models.HrLeaveHoliday;
using eWroks.Api.Models.HrOvertimeWork;
using eWroks.Api.Models.ItAcountAssets;
using eWroks.Api.Models.ItAssets;
using eWroks.Api.Models.ItBackupRecord;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace eWroks.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            #region CORS
            //[CORS][1] CORS 사용 등록
            //[CORS][1][1] 기본: 모두 허용
            services.AddCors(options =>
            {
                //[A] [EnableCors] 특성으로 적용 가능 
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
                //[B] [EnableCors("AllowAnyOrigin")] 형태로 적용 가능
                options.AddPolicy("AllowAnyOrigin", builder =>
                    builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
            #endregion

            services.AddSingleton(Configuration);
            services.AddTransient<ICmUserRepository, CmUserRepository>();
            services.AddTransient<ICommonRepository, CommonRepository>();
            services.AddTransient<ICmLoginRepository, CmLoginRepository>();
            services.AddTransient<ICmCodeRepository, CmCodeRepository>();
            services.AddTransient<ICmProgramRepository, CmProgramRepository>();
            services.AddTransient<ICmRoleProgramRepository, CmRoleProgramRepository>();
            services.AddTransient<ICmDeptRepository, CmDeptRepository>();
            services.AddTransient<ICmVendorRepository, CmVendorRepository>();
            services.AddTransient<ICmNoticeRepository, CmNoticeRepository>();
            services.AddTransient<ICmHoliDayRepository, CmHoliDayRepository>();
            services.AddTransient<ICmApprovalRepository, CmApprovalRepository>();
            services.AddTransient<ICmMainRepository, CmMainRepository>();
            services.AddTransient<ICmMeetingRoomRepository, CmMeetingRoomRepository>();

            // Finance
            services.AddTransient<IFiTravelRepository, FiTravelRepository>();
            services.AddTransient<IFiPurchaseSettingRepositry, FiPurchaseSettingRepositry>();
            services.AddTransient<IFiPurchaseRepository, FiPurchaseRepository>();

            // HR
            services.AddTransient<IHrCertificateRepository, HrCertificateRepository>();
            services.AddTransient<IHrExternalTrainingRepository, HrExternalTrainingRepository>();
            services.AddTransient<IHrLeaveHolidayRepository, HrLeaveHolidayRepository>();
            services.AddTransient<IHrHealthCheckRepository, HrHealthCheckRepository>();
            services.AddTransient<IHrOvertimeWrokRepository, HrOvertimeWrokRepository>();

            // IT
            services.AddTransient<IItAssetsRepository, ItAssetsRepository>();
            services.AddTransient<IItAcountAssetsRepository, ItAcountAssetsRepository>();
            services.AddTransient<IItBackupRecordRepository, ItBackupRecordRepository>();

            // CB
            services.AddTransient<ICbScheduleRepository, CbScheduleRepository>();
            services.AddTransient<ICbTimeSheetRepository, CbTimeSheetRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors();

            app.UseStaticFiles();
            
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
